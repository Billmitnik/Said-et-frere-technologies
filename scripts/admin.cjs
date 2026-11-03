// Admin maintenance tool (works with Vercel once the folder is linked, else Netlify). Run from the project folder:
//   npm run admin:mot-de-passe   change (or reset) the admin password
//   npm run admin:installer      apply migrations, create the database roles, choose the
//                                password, then store everything in .env and on the host
//   node scripts/admin.cjs verifier   inspect only, change nothing
// Secrets are read from .env, sent only to the database and the host, and never printed.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { spawnSync } = require("child_process");

const SITE_ROLE = "said_freres_site";
const ADMIN_ROLE = "said_freres_admin";
const NETLIFY_CONTEXTS = ["production", "deploy-preview", "branch-deploy"];
const SCRYPT = { N: 32768, r: 8, p: 1, keyLength: 64 };
const MIN_PASSWORD_LENGTH = 12;

const projectDir = process.cwd();
const envFile = path.join(projectDir, ".env");
const secrets = [];

function hide(text) {
  return secrets.reduce((out, secret) => out.split(secret).join("********"), String(text ?? ""));
}

function remember(...values) {
  for (const value of values) if (value) secrets.push(value);
}

function fail(message) {
  console.error(`\nÉchec : ${hide(message)}`);
  process.exit(1);
}

// --- .env -----------------------------------------------------------------

function readEnv() {
  if (!fs.existsSync(envFile)) fail("fichier .env introuvable. Lancez la commande depuis le dossier du projet.");
  const text = fs.readFileSync(envFile, "utf8");
  const lines = text.split(/\r?\n/);
  const get = (key) => {
    const line = lines.find((entry) => entry.startsWith(`${key}=`));
    return line ? line.slice(key.length + 1).trim().replace(/^"(.*)"$/, "$1") : "";
  };
  return { text, lines, get };
}

function writeEnv(env, updates) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
  const backup = path.join(projectDir, `.env.backup-${stamp}`);
  fs.copyFileSync(envFile, backup);
  const newline = env.text.includes("\r\n") ? "\r\n" : "\n";
  const lines = env.lines.map((line) => {
    const key = Object.keys(updates).find((name) => line.startsWith(`${name}=`));
    return key ? `${key}="${updates[key]}"` : line;
  });
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  for (const [key, value] of Object.entries(updates)) {
    if (!env.lines.some((line) => line.startsWith(`${key}=`))) lines.push(`${key}="${value}"`);
  }
  fs.writeFileSync(envFile, [...lines, ""].join(newline));
  console.log(`OK : .env mis à jour (copie de l'ancien fichier : ${path.basename(backup)}).`);
}

// --- Netlify ----------------------------------------------------------------

function findNetlifyCli() {
  const candidates = [];
  const lookup = spawnSync(process.platform === "win32" ? "where" : "which", ["netlify"], { encoding: "utf8" });
  for (const found of (lookup.stdout || "").split(/\r?\n/).filter(Boolean)) {
    try {
      const real = fs.realpathSync(found);
      if (real.endsWith("run.js")) candidates.push(real);
    } catch {}
    candidates.push(path.join(path.dirname(found), "node_modules", "netlify-cli", "bin", "run.js"));
  }
  candidates.push(path.join(path.dirname(process.execPath), "node_modules", "netlify-cli", "bin", "run.js"));
  if (process.env.APPDATA) candidates.push(path.join(process.env.APPDATA, "npm", "node_modules", "netlify-cli", "bin", "run.js"));
  return candidates.find((file) => fs.existsSync(file)) ?? null;
}

function createNetlify() {
  const cli = findNetlifyCli();
  if (!cli) fail("Netlify CLI introuvable. Installez-le avec « npm install -g netlify-cli » puis « netlify login ».");
  const stateFile = path.join(projectDir, ".netlify", "state.json");
  const siteId = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")).siteId : null;
  if (!siteId) fail("projet non relié à Netlify. Lancez « netlify link » dans ce dossier.");

  const run = (args) => spawnSync(process.execPath, [cli, ...args], { cwd: projectDir, encoding: "utf8" });
  const api = (method, data) => {
    const result = run(["api", method, "--data", JSON.stringify(data)]);
    if (result.status !== 0) fail(`Netlify (${method}) : ${result.stdout}${result.stderr}`);
    return JSON.parse(result.stdout);
  };
  const missingContexts = (key) => {
    const accountId = api("getSite", { site_id: siteId }).account_id;
    const variable = api("getEnvVars", { account_id: accountId, site_id: siteId }).find((entry) => entry.key === key);
    return NETLIFY_CONTEXTS.filter((context) => !variable?.values.some((entry) => entry.context === context || entry.context === "all"));
  };

  return {
    // One context per call: Netlify refuses context and scope together on an existing variable.
    setSecret(key, value) {
      for (let attempt = 1; attempt <= 2; attempt += 1) {
        const contexts = attempt === 1 ? NETLIFY_CONTEXTS : missingContexts(key);
        for (const context of contexts) {
          const result = run(["env:set", key, value, "--context", context, "--secret", "--force"]);
          if (result.status !== 0) fail(`Netlify ${key} (${context}) : ${result.stdout}${result.stderr}${result.error?.message ?? ""}`);
        }
        if (missingContexts(key).length === 0) {
          console.log(`OK : ${key} enregistrée sur Netlify.`);
          return;
        }
      }
      fail(`Netlify n'a pas enregistré ${key} pour : ${missingContexts(key).join(", ")}.`);
    },
    // Netlify applies new settings only to new deploys.
    redeploy() {
      api("createSiteBuild", { site_id: siteId });
      console.log("OK : remise en ligne lancée (2 à 3 minutes).");
    },
    check() {
      api("getSite", { site_id: siteId });
      console.log("Netlify : connexion et projet OK.");
    },
  };
}

// --- Vercel -----------------------------------------------------------------

function createVercel() {
  // npx is a .cmd file on Windows, so it needs a shell; secrets only ever go through stdin.
  const run = (args, input) => {
    const command = ["npx", "--yes", "vercel@65.10.0", ...args];
    return process.platform === "win32"
      ? spawnSync(command.join(" "), { cwd: projectDir, encoding: "utf8", input, shell: true })
      : spawnSync(command[0], command.slice(1), { cwd: projectDir, encoding: "utf8", input });
  };
  if (run(["whoami"]).status !== 0) fail("Vercel CLI non connecté. Lancez d'abord « npm run vercel:installer ».");

  return {
    setSecret(key, value) {
      const result = run(["env", "add", key, "--environment", "production", "--sensitive", "--force", "--yes"], value);
      if (result.status !== 0) fail(`Vercel ${key} : ${result.stdout}${result.stderr}`);
      console.log(`OK : ${key} enregistrée sur Vercel.`);
    },
    // Vercel applies new settings only to new deploys.
    redeploy() {
      console.log("Remise en ligne sur Vercel (3 à 5 minutes)…");
      const result = run(["deploy", "--prod", "--yes"]);
      if (result.status !== 0) fail(`remise en ligne Vercel : ${result.stdout}${result.stderr}`);
      console.log("OK : remise en ligne terminée.");
    },
    check() {
      console.log("Vercel : connexion et projet OK.");
    },
  };
}

/** The site is hosted on Vercel once the folder is linked to a Vercel project, else on Netlify. */
function createHost() {
  return fs.existsSync(path.join(projectDir, ".vercel", "project.json")) ? createVercel() : createNetlify();
}

// --- Database ---------------------------------------------------------------

function loadPg() {
  const pgPath = path.join(projectDir, "node_modules", "pg");
  if (!fs.existsSync(pgPath)) fail("dépendances absentes. Lancez d'abord « npm install ».");
  process.removeAllListeners("warning");
  return require(pgPath).Client;
}

function parseDatabaseUrl(value, name) {
  if (!/^postgres(ql)?:\/\//.test(value)) fail(`${name} manquante ou invalide dans .env.`);
  const url = new URL(value);
  remember(value, decodeURIComponent(url.password));
  return url;
}

async function withClient(Client, connectionString, work) {
  const client = new Client({ connectionString, connectionTimeoutMillis: 20_000 });
  await client.connect();
  try {
    return await work(client);
  } finally {
    await client.end();
  }
}

/** Creates the role, or gives it a new password, and returns a pooled URL for it. */
async function upsertRole(owner, role, poolerUrl) {
  const exists = (await owner.query("select 1 from pg_roles where rolname = $1", [role])).rowCount > 0;
  const password = crypto.randomBytes(24).toString("base64url");
  remember(password);
  // New roles get no superuser, createdb or createrole rights by default; naming those
  // attributes in ALTER ROLE would need superuser rights the Neon owner does not have.
  await owner.query(`${exists ? "ALTER" : "CREATE"} ROLE ${owner.escapeIdentifier(role)} WITH LOGIN PASSWORD '${password}'`);
  const url = new URL(poolerUrl);
  const channelBinding = url.searchParams.get("channel_binding");
  url.username = role;
  url.password = password;
  url.search = "";
  if (channelBinding) url.searchParams.set("channel_binding", channelBinding);
  url.searchParams.set("sslmode", "verify-full");
  remember(url.toString());
  return url.toString();
}

async function expectPermissionDenied(client, sql) {
  try {
    await client.query(sql);
    return false;
  } catch (error) {
    if (error.code === "42501") return true;
    throw error;
  }
}

// --- Admin password ---------------------------------------------------------

function ask(question, hidden) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = (text) => rl.output.write(text.startsWith(question) ? question : text.replace(/[^\r\n]/g, "*"));
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

// Groups of easy-to-type characters (no 0/o, 1/l/i): about 80 bits, e.g. "kxm7-pq4t-wz8n-r3vb".
function generatePassword() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => alphabet[crypto.randomInt(alphabet.length)]).join("")).join("-");
}

async function choosePassword() {
  console.log(`\nMot de passe de l'administration : au moins ${MIN_PASSWORD_LENGTH} caractères (lettres, chiffres, tirets).`);
  console.log("Le plus simple : appuyez directement sur Entrée, et un mot de passe sûr sera créé pour vous.");
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const first = await ask("Mot de passe (ou Entrée pour en créer un) : ", true);
    if (first === "") {
      const generated = generatePassword();
      console.log("\nVoici votre mot de passe d'administration. NOTEZ-LE MAINTENANT (papier ou téléphone) :\n");
      console.log(`        ${generated}\n`);
      await ask("Quand il est noté, appuyez sur Entrée. L'écran sera effacé pour le cacher. ", false);
      // Clear the screen and the scrollback so the password does not stay visible.
      process.stdout.write("\x1b[2J\x1b[3J\x1b[H");
      console.log("Écran effacé. Suite…");
      return generated;
    }
    if (first.length < MIN_PASSWORD_LENGTH || first.length > 200) {
      console.log(`Longueur incorrecte : ${first.length} caractères (il en faut entre ${MIN_PASSWORD_LENGTH} et 200). Recommencez, ou appuyez sur Entrée pour en créer un.`);
      continue;
    }
    if (first !== await ask("Retapez le mot de passe : ", true)) {
      console.log("Les deux saisies sont différentes. Recommencez.");
      continue;
    }
    return first;
  }
  fail("mot de passe non confirmé après 3 essais. Rien n'a été modifié dans .env ni sur Netlify.");
}

/** Format read by lib/server/admin/auth.ts; no "$" because Next.js expands it in .env. */
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, SCRYPT.keyLength, {
    N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p, maxmem: 256 * SCRYPT.N * SCRYPT.r,
  });
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64url"), hash.toString("base64url")].join(":");
}

async function passwordSettings() {
  const password = await choosePassword();
  const settings = {
    ADMIN_PASSWORD_HASH: hashPassword(password),
    // A new secret also signs out every open admin session.
    ADMIN_SESSION_SECRET: crypto.randomBytes(48).toString("base64url"),
  };
  remember(password, ...Object.values(settings));
  return settings;
}

// --- Commands ---------------------------------------------------------------

async function changePassword() {
  const env = readEnv();
  if (!env.get("ADMIN_DATABASE_URL")) fail("l'administration n'est pas encore installée. Lancez « npm run admin:installer ».");
  const host = createHost();
  const settings = await passwordSettings();
  writeEnv(env, settings);
  for (const [key, value] of Object.entries(settings)) host.setSecret(key, value);
  host.redeploy();
  console.log("\nTerminé. Le nouveau mot de passe sera actif en ligne dans 3 minutes (et tout de suite en local).");
}

function migrationsPending(prismaCli) {
  const status = spawnSync(process.execPath, [prismaCli, "migrate", "status"], { cwd: projectDir, encoding: "utf8" });
  const output = `${status.stdout}${status.stderr}`;
  if (/not yet been applied/i.test(output)) return true;
  if (/Database schema is up to date/i.test(output)) return false;
  fail(`état des migrations illisible : ${output}`);
}

async function install(checkOnly) {
  const env = readEnv();
  const Client = loadPg();
  const ownerUrl = parseDatabaseUrl(env.get("DIRECT_URL"), "DIRECT_URL");
  const poolerUrl = parseDatabaseUrl(env.get("DATABASE_URL"), "DATABASE_URL");
  const prismaCli = path.join(projectDir, "node_modules", "prisma", "build", "index.js");
  if (!fs.existsSync(prismaCli)) fail("Prisma introuvable. Lancez d'abord « npm install ».");
  const host = createHost();

  const pending = migrationsPending(prismaCli);
  console.log(pending ? "Migrations en attente." : "Base à jour (aucune migration en attente).");
  if (checkOnly) {
    host.check();
    await withClient(Client, ownerUrl.toString(), async (owner) => {
      for (const role of [SITE_ROLE, ADMIN_ROLE]) {
        const exists = (await owner.query("select 1 from pg_roles where rolname = $1", [role])).rowCount > 0;
        console.log(`Compte ${role} : ${exists ? "présent" : "absent"}.`);
      }
    });
    console.log(`DATABASE_URL utilise ${poolerUrl.username === SITE_ROLE ? "le compte en lecture seule" : "un autre compte"} ; administration ${env.get("ADMIN_DATABASE_URL") ? "configurée" : "non configurée"} dans .env.`);
    console.log("Vérification terminée. Aucune modification effectuée.");
    return;
  }

  if (pending) {
    const migrate = spawnSync(process.execPath, [prismaCli, "migrate", "deploy"], { cwd: projectDir, encoding: "utf8" });
    if (migrate.status !== 0) fail(`migration : ${migrate.stdout}${migrate.stderr}`);
    console.log("OK : migrations appliquées.");
  }

  const updates = {};
  await withClient(Client, ownerUrl.toString(), async (owner) => {
    const database = owner.escapeIdentifier(ownerUrl.pathname.slice(1));
    const site = owner.escapeIdentifier(SITE_ROLE);
    const admin = owner.escapeIdentifier(ADMIN_ROLE);

    if (poolerUrl.username !== SITE_ROLE) updates.DATABASE_URL = await upsertRole(owner, SITE_ROLE, poolerUrl.toString());
    else await owner.query(`ALTER ROLE ${site} WITH LOGIN`);
    await owner.query(`GRANT CONNECT ON DATABASE ${database} TO ${site}`);
    await owner.query(`GRANT USAGE ON SCHEMA public TO ${site}`);
    await owner.query(`GRANT SELECT ON TABLE public.products, public.product_images TO ${site}`);

    updates.ADMIN_DATABASE_URL = await upsertRole(owner, ADMIN_ROLE, poolerUrl.toString());
    await owner.query(`GRANT CONNECT ON DATABASE ${database} TO ${admin}`);
    await owner.query(`GRANT USAGE ON SCHEMA public TO ${admin}`);
    await owner.query(`GRANT SELECT, INSERT, UPDATE ON TABLE public.products TO ${admin}`);
    await owner.query(`GRANT SELECT, INSERT, DELETE ON TABLE public.product_images, public.admin_login_attempts TO ${admin}`);
  });
  console.log("OK : comptes de base de données prêts.");

  const siteUrl = updates.DATABASE_URL ?? poolerUrl.toString();
  const siteReadOnly = await withClient(Client, siteUrl, async (site) => {
    await site.query("select count(*) from public.products");
    await site.query("select count(*) from public.product_images");
    return expectPermissionDenied(site, "update public.products set name = name where false");
  });
  const adminCannotDelete = await withClient(Client, updates.ADMIN_DATABASE_URL, async (admin) => {
    await admin.query("begin");
    await admin.query("insert into public.admin_login_attempts (id, ip) values (gen_random_uuid(), 'test')");
    await admin.query("rollback");
    return expectPermissionDenied(admin, "delete from public.products where false");
  });
  if (!siteReadOnly || !adminCannotDelete) fail("les droits des comptes ne sont pas ceux attendus. Rien n'a été changé dans .env ni sur Netlify.");
  console.log("OK : tests réussis (site en lecture seule, administration sans suppression de produit).");

  Object.assign(updates, await passwordSettings());
  writeEnv(env, updates);
  for (const [key, value] of Object.entries(updates)) host.setSecret(key, value);
  host.redeploy();
  console.log("\nTerminé. L'administration sera active en ligne dans 3 minutes.");
}

const command = process.argv[2];
const commands = {
  "mot-de-passe": () => changePassword(),
  installer: () => install(false),
  verifier: () => install(true),
};
if (!commands[command]) {
  console.log("Usage : npm run admin:mot-de-passe | npm run admin:installer | node scripts/admin.cjs verifier");
  process.exit(1);
}
commands[command]().catch((error) => fail(error.message));
