"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const symptoms = [
  { value: "L’ordinateur ne s’allume plus", title: "Ne s’allume plus", detail: "Pas de voyant ou aucun démarrage", icon: "⏻" },
  { value: "L’ordinateur est très lent ou se bloque", title: "Lent ou bloqué", detail: "Ralentissements, écran figé", icon: "◷" },
  { value: "L’écran reste noir ou affiche des lignes", title: "Écran / affichage", detail: "Écran noir, lignes, clignotement", icon: "▣" },
  { value: "La batterie ne charge plus", title: "Batterie / charge", detail: "Ne charge pas ou se vide vite", icon: "▰" },
  { value: "Le clavier, le pavé tactile ou les ports ne répondent plus", title: "Clavier / ports", detail: "Touches, souris ou connecteurs", icon: "⌨" },
  { value: "Le Wi-Fi ou Internet ne fonctionne pas", title: "Wi-Fi / connexion", detail: "Réseau instable ou absent", icon: "⌁" },
  { value: "Le disque ou les fichiers ne sont plus accessibles", title: "Disque / fichiers", detail: "Disque non reconnu, fichiers absents", icon: "▤" },
  { value: "L’ordinateur chauffe ou fait un bruit inhabituel", title: "Chauffe / bruit", detail: "Ventilateur bruyant ou surchauffe", icon: "♨" },
  { value: "Il y a un dommage physique ou un problème de carte mère", title: "Dommage physique", detail: "Choc, liquide, charnière, carte mère", icon: "⚙" },
  { value: "Autre problème technique", title: "Autre problème", detail: "Précisez le symptôme ci-dessous", icon: "?" },
] as const;

const devices = [
  "Ordinateur portable",
  "Ordinateur de bureau",
  "Écran externe",
  "Disque dur ou SSD",
  "Autre appareil",
] as const;

const controlCharacters = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  return String(value ?? "").replace(controlCharacters, "").trim().slice(0, maxLength);
}

export function DiagnosticForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => setReady(true), []);

  function focusField(name: string) {
    const field = formRef.current?.elements.namedItem(name);
    if (field && "focus" in field && typeof field.focus === "function") field.focus();
  }

  function submitDiagnostic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const allowedSymptoms = new Set<string>(symptoms.map((symptom) => symptom.value));
    const allowedDevices = new Set<string>(devices);
    const selectedSymptoms = formData.getAll("symptoms")
      .map((symptom) => cleanText(symptom, 120))
      .filter((symptom) => allowedSymptoms.has(symptom));
    const device = cleanText(formData.get("device"), 60);

    if (selectedSymptoms.length === 0) {
      setResult("Sélectionnez au moins un problème observé.");
      return;
    }
    if (!device || !allowedDevices.has(device)) {
      setResult("Choisissez le type d’appareil concerné.");
      focusField("device");
      return;
    }

    const model = cleanText(formData.get("model"), 100);
    const description = cleanText(formData.get("description"), 1500);
    const physicalIssue = selectedSymptoms.some((symptom) => /dommage physique|carte mère/i.test(symptom));
    if (physicalIssue && description.length < 20) {
      setResult("Pour un dommage physique ou une carte mère, décrivez les dégâts en au moins 20 caractères.");
      focusField("description");
      return;
    }

    const customerName = cleanText(formData.get("customerName"), 100);
    if (customerName.length < 2) {
      setResult("Indiquez votre nom (2 caractères minimum).");
      focusField("customerName");
      return;
    }

    const message = [
      "Bonjour SAID & FRÈRES TECHNOLOGIES, je souhaite demander un diagnostic :",
      "",
      `Nom : ${customerName}`,
      `Appareil : ${device}`,
      `Marque / modèle : ${model || "Non précisé"}`,
      `Problème(s) : ${selectedSymptoms.join(", ")}`,
      `Description : ${description || "Non précisée"}`,
    ].join("\n");
    const whatsappUrl = createWhatsAppUrl(message);

    if (!whatsappUrl) {
      setResult("Le numéro WhatsApp de la boutique n’est pas configuré. Votre demande n’a pas été envoyée.");
      return;
    }

    window.location.assign(whatsappUrl);
  }

  return (
    <form ref={formRef} className="diagnostic-form" id="diagnostic-form" onSubmit={submitDiagnostic}>
      <fieldset className="symptom-fieldset">
        <legend>1. Choisissez les problèmes observés <span>(plusieurs choix possibles)</span></legend>
        <div className="symptom-grid">
          {symptoms.map((symptom) => (
            <label className="symptom-card" key={symptom.value}>
              <input type="checkbox" name="symptoms" value={symptom.value} />
              <span className="symptom-icon" aria-hidden="true">{symptom.icon}</span>
              <strong>{symptom.title}</strong>
              <small>{symptom.detail}</small>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="diagnostic-fields">
        <label>2. Type d’appareil
          <select name="device" required defaultValue="">
            <option value="">Choisir…</option>
            {devices.map((device) => <option key={device} value={device}>{device}</option>)}
          </select>
        </label>
        <label>Marque et modèle <span>(si connus)</span>
          <input name="model" type="text" maxLength={100} placeholder="Ex. marque, référence ou modèle" />
        </label>
        <label className="description-field">3. Décrivez le problème <span>(obligatoire pour dommage physique ou carte mère)</span>
          <textarea
            name="description"
            rows={5}
            maxLength={1500}
            placeholder="Quand le problème a-t-il commencé ? Que s’est-il passé ? Décrivez les dégâts visibles, les pièces concernées ou le message d’erreur. Évitez les mots de passe et les données sensibles."
          />
        </label>
        <div className="diagnostic-contact">
          <label htmlFor="diagnostic-customer-name">Votre nom
            <input id="diagnostic-customer-name" name="customerName" type="text" maxLength={100} autoComplete="name" required />
          </label>
        </div>
        <p className="diagnostic-notice">
          Le site ne sauvegarde ni ne transmet ces informations en arrière-plan. WhatsApp s’ouvrira avec votre message prérempli : vérifiez-le puis appuyez sur Envoyer pour le transmettre à la boutique.
        </p>
        <noscript>
          <p className="diagnostic-notice">Activez JavaScript pour préparer votre demande WhatsApp. Aucune information ne sera envoyée sans votre action.</p>
        </noscript>
        <button className="primary-button submit-diagnostic" type="submit" disabled={!ready}>
          Continuer sur WhatsApp <span aria-hidden="true">→</span>
        </button>
        <p className="diagnostic-result" role="status" aria-live="polite">{result}</p>
      </div>
    </form>
  );
}
