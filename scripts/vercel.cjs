// Vercel hosting tool. Run from the project folder:
//   npm run vercel:installer   sign in, create or link the Vercel project, copy the secret
//                              settings from .env, then deploy to production
//   npm run vercel:deployer    deploy the current folder to production again
//   node scripts/vercel.cjs verifier   show the sign-in and project status, change nothing
// Secrets are passed to Vercel through stdin, never on the command line, and never printed.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const CLI = ["--yes", "vercel@65.10.0"];
const SECRET_KEYS = ["DATABASE_URL", "ADMIN_DATABASE_URL", "ADMIN_PASSWORD_HASH", "ADMIN_SESSION_SECRET"];
const projectDir = process.cwd();
const secrets = [];
const hide = (text) => secrets.reduce((out, secret) => out.split(secret).join("********"), String(text ?? ""));

function fail(message) {
  console.error(`\nÉchec : ${hide(message)}`);
  process.exit(1);
}

// npx is a .cmd file on Windows, so it needs a shell; only fixed words go on that command line.
function vercel(args, { input, interactive = false } = {}) {
  const options = { cwd: projectDir, encoding: "utf8", input, stdio: interactive ? "inherit" : ["pipe", "pipe", "pipe"] };
  const result = process.platform === "win32"
    ? spawnSync(["npx", ...CLI, ...args].join(" "), { ...options, shell: true })
    : spawnSync("npx", [...CLI, ...args], options);
  if (result.error) fail(`impossible de lancer Vercel CLI : ${result.error.message}`);
  return { ok: result.status === 0, output: `${result.stdout ?? ""}${result.stderr ?? ""}` };
}

function readSecrets() {
  const envFile = path.join(projectDir, ".env");
  if (!fs.existsSync(envFile)) fail("fichier .env introuvable. Lancez la commande depuis le dossier du projet.");
  const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
  return Object.fromEntries(SECRET_KEYS.map((key) => {
    const line = lines.find((entry) => entry.startsWith(`${key}=`));
    const value = line ? line.slice(key.length + 1).trim().replace(/^"(.*)"$/, "$1") : "";
    if (!value) fail(`${key} est absente de .env. Lancez d'abord « npm run admin:installer ».`);
    secrets.push(value);
    return [key, value];
  }));
}

function ensureSignedIn() {
  if (vercel(["whoami"]).ok) return;
  console.log("\nConnexion à Vercel : une page va s'ouvrir dans votre navigateur.");
  console.log("Connectez-vous (ou créez le compte gratuit avec « Continue with GitHub »), puis revenez ici.\n");
  if (!vercel(["login"], { interactive: true }).ok) fail("connexion à Vercel non terminée.");
  if (!vercel(["whoami"]).ok) fail("connexion à Vercel non confirmée.");
}

function linkProject() {
  const linkFile = path.join(projectDir, ".vercel", "project.json");
  if (fs.existsSync(linkFile)) return;
  const link = vercel(["link", "--yes"]);
  if (!link.ok || !fs.existsSync(linkFile)) fail(`création du projet Vercel : ${link.output}`);
  console.log("OK : projet Vercel créé et relié à ce dossier.");
}

function deployProduction() {
  console.log("Mise en ligne sur Vercel (3 à 5 minutes)…");
  const deploy = vercel(["deploy", "--prod", "--yes"]);
  if (!deploy.ok) fail(`mise en ligne : ${deploy.output}`);
  const urls = [...new Set(deploy.output.match(/https:\/\/[a-z0-9.-]+\.vercel\.app/g) ?? [])];
  const shortest = urls.sort((a, b) => a.length - b.length)[0];
  console.log(`OK : site en ligne${shortest ? ` : ${shortest}` : "."}`);
  return shortest;
}

function install() {
  const values = readSecrets();
  ensureSignedIn();
  linkProject();
  for (const [key, value] of Object.entries(values)) {
    const result = vercel(["env", "add", key, "--environment", "production", "--sensitive", "--force", "--yes"], { input: value });
    if (!result.ok) fail(`réglage ${key} : ${result.output}`);
    console.log(`OK : ${key} enregistrée sur Vercel.`);
  }
  const url = deployProduction();
  const git = vercel(["git", "connect", "--yes"]);
  console.log(git.ok || /already connected/i.test(git.output)
    ? "OK : dépôt GitHub relié, chaque envoi sur GitHub sera mis en ligne automatiquement."
    : "À faire une fois : sur vercel.com, ouvrez le projet → Settings → Git → Connect Git Repository, pour la mise en ligne automatique.");
  console.log(`\nTerminé.${url ? ` Ouvrez ${url}` : ""}`);
}

function check() {
  const who = vercel(["whoami"]);
  console.log(who.ok ? `Vercel : connecté (${who.output.trim().split(/\r?\n/).pop()}).` : "Vercel : non connecté.");
  const linked = fs.existsSync(path.join(projectDir, ".vercel", "project.json"));
  console.log(`Projet Vercel relié à ce dossier : ${linked ? "oui" : "non"}.`);
  console.log("Vérification terminée. Aucune modification effectuée.");
}

const commands = {
  installer: install,
  deployer: () => {
    ensureSignedIn();
    linkProject();
    deployProduction();
  },
  verifier: check,
};
const command = commands[process.argv[2]];
if (!command) {
  console.log("Usage : npm run vercel:installer | npm run vercel:deployer | node scripts/vercel.cjs verifier");
  process.exit(1);
}
command();
