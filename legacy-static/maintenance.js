"use strict";

/*
 * Formulaire de diagnostic — version démonstration (aucun back-end de réception).
 *
 * Sécurité :
 * - Aucune donnée n’est envoyée, stockée ou journalisée : la demande reste dans la page.
 * - Les valeurs lues sont nettoyées, bornées puis affichées via textContent (jamais innerHTML),
 *   ce qui empêche toute injection HTML/JavaScript.
 * - Les coordonnées de l’aperçu sont partiellement masquées.
 * - Quand le canal de réception sera branché : revalider côté serveur, ajouter un jeton CSRF,
 *   du rate-limiting, HTTPS et une politique de rétention (aucune donnée personnelle dans les logs).
 */

const diagnosticForm = document.querySelector("#diagnostic-form");
const diagnosticResult = document.querySelector("#diagnostic-result");
const submitButton = diagnosticForm.querySelector('button[type="submit"]');

const MAX_LENGTHS = Object.freeze({
  model: 100,
  description: 1500,
  customerName: 100,
  phone: 30,
  email: 150
});
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?\d(?:[\s().-]*\d){6,14}$/;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

function cleanText(value, maxLength) {
  return String(value ?? "").replace(CONTROL_CHARACTERS, "").trim().slice(0, maxLength);
}

function allowedValues(selector) {
  return new Set(Array.from(diagnosticForm.querySelectorAll(selector), (field) => field.value));
}

function focusField(name) {
  const field = diagnosticForm.elements.namedItem(name);
  if (field && typeof field.focus === "function") field.focus();
}

function maskPhone(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "•••";
  return `${"•".repeat(digits.length - 4)}${digits.slice(-4)}`;
}

function maskEmail(value) {
  const [localPart, domain] = value.split("@");
  if (!localPart || !domain) return "•••";
  return `${localPart.slice(0, 1)}•••@${domain}`;
}

diagnosticForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(diagnosticForm);
  const allowedSymptoms = allowedValues('input[name="symptoms"]');
  const allowedDevices = allowedValues('select[name="device"] option:not([value=""])');
  const allowedContactChannels = allowedValues('input[name="contact"]');

  const symptoms = formData.getAll("symptoms")
    .map((symptom) => cleanText(symptom, 120))
    .filter((symptom) => allowedSymptoms.has(symptom));
  const device = cleanText(formData.get("device"), 60);
  const physicalIssue = symptoms.some((symptom) => /dommage physique|carte mère/i.test(symptom));

  if (symptoms.length === 0) {
    diagnosticResult.textContent = "Sélectionnez au moins un problème observé.";
    return;
  }
  if (!device || !allowedDevices.has(device)) {
    diagnosticResult.textContent = "Choisissez le type d’appareil concerné.";
    focusField("device");
    return;
  }

  const model = cleanText(formData.get("model"), MAX_LENGTHS.model);
  const description = cleanText(formData.get("description"), MAX_LENGTHS.description);
  if (physicalIssue && description.length < 20) {
    diagnosticResult.textContent = "Pour un dommage physique ou une carte mère, décrivez les dégâts en au moins 20 caractères.";
    focusField("description");
    return;
  }

  const customerName = cleanText(formData.get("customerName"), MAX_LENGTHS.customerName);
  if (customerName.length < 2) {
    diagnosticResult.textContent = "Indiquez votre nom (2 caractères minimum).";
    focusField("customerName");
    return;
  }

  const phone = cleanText(formData.get("phone"), MAX_LENGTHS.phone);
  if (!PHONE_PATTERN.test(phone)) {
    diagnosticResult.textContent = "Indiquez un numéro de téléphone valide (chiffres, espaces, +, - ou points).";
    focusField("phone");
    return;
  }

  const email = cleanText(formData.get("email"), MAX_LENGTHS.email);
  const contactChannels = formData.getAll("contact")
    .map((channel) => cleanText(channel, 40))
    .filter((channel) => allowedContactChannels.has(channel));

  if (email && !EMAIL_PATTERN.test(email)) {
    diagnosticResult.textContent = "L’adresse e-mail saisie n’est pas valide.";
    focusField("email");
    return;
  }
  if (contactChannels.includes("E-mail") && !email) {
    diagnosticResult.textContent = "Saisissez votre adresse e-mail ou choisissez un autre canal de réponse.";
    focusField("email");
    return;
  }

  const request = [
    `Appareil : ${device}`,
    `Marque / modèle : ${model || "Non précisé"}`,
    `Problème(s) : ${symptoms.join(", ")}`,
    `Description : ${description || "Non précisée"}`,
    `Client : ${customerName}`,
    `Téléphone : ${maskPhone(phone)} (masqué)`,
    `E-mail : ${email ? `${maskEmail(email)} (masqué)` : "Non renseigné"}`,
    `Réponse souhaitée : ${contactChannels.join(", ") || "À convenir"}`
  ].join("\n");

  diagnosticResult.textContent = `Demande préparée, mais pas envoyée : aucun canal de réception n’est encore configuré. Aucune donnée n’a été enregistrée ni transmise. Aperçu (coordonnées masquées) :\n${request}`;
});

submitButton.disabled = false;
