"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CartEntry } from "@/components/shop/CartDialog";
import { createWhatsAppUrl } from "@/lib/whatsapp";

type CheckoutDialogProps = {
  open: boolean;
  entries: CartEntry[];
  total: number;
  formatPrice: (price: number) => string;
  onClose: () => void;
};

function cleanField(value: FormDataEntryValue | null, maxLength: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function CheckoutDialog({ open, entries, total, formatPrice, onClose }: CheckoutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customerName = cleanField(formData.get("customerName"), 100);
    const deliveryLocation = cleanField(formData.get("deliveryLocation"), 300);

    if (customerName.length < 2) {
      setResult("Indiquez votre nom (2 caractères minimum).");
      return;
    }
    if (deliveryLocation.length < 5) {
      setResult("Indiquez votre quartier et un repère pour la livraison.");
      return;
    }
    if (entries.length === 0) {
      setResult("Votre panier est vide. Ajoutez un article avant de commander.");
      return;
    }

    const itemLines = entries.map(({ product, quantity }) => {
      const unitPrice = product.price ?? 0;
      return `• ${product.name} — ${quantity} × ${formatPrice(unitPrice)} = ${formatPrice(unitPrice * quantity)}`;
    });
    const message = [
      "Bonjour SAID & FRÈRES TECHNOLOGIES, je souhaite passer cette commande :",
      "",
      ...itemLines,
      "",
      `Total indicatif : ${formatPrice(total)}`,
      `Nom : ${customerName}`,
      `Lieu de livraison : ${deliveryLocation}`,
      "Paiement à la livraison.",
      "Merci de confirmer le prix, la disponibilité et les modalités de livraison.",
    ].join("\n");

    const whatsappUrl = createWhatsAppUrl(message);
    if (!whatsappUrl) {
      setResult("Le numéro WhatsApp de la boutique n’est pas configuré. Votre commande n’a pas été envoyée.");
      return;
    }

    window.location.assign(whatsappUrl);
  }

  return (
    <dialog
      ref={dialogRef}
      className="checkout-dialog"
      id="checkout-dialog"
      aria-labelledby="checkout-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className="dialog-heading">
        <div><p className="eyebrow eyebrow-dark">Commande</p><h2 id="checkout-title">Finaliser sur WhatsApp</h2></div>
        <button className="icon-button" id="close-checkout" type="button" aria-label="Fermer" onClick={() => dialogRef.current?.close()}>×</button>
      </div>
      <p className="checkout-explanation">
        Votre message de commande s’ouvrira dans WhatsApp. Vérifiez-le puis appuyez sur Envoyer. La boutique confirmera le prix, le stock et la livraison. Vous paierez à la livraison.
      </p>
      <div className="checkout-total">
        <span>Total affiché, à confirmer</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <form className="checkout-fields" onSubmit={submitOrder}>
        <label htmlFor="order-customer-name">Votre nom</label>
        <input
          id="order-customer-name"
          name="customerName"
          type="text"
          maxLength={100}
          autoComplete="name"
          required
        />
        <label htmlFor="order-delivery-location">Quartier et lieu de livraison</label>
        <textarea
          id="order-delivery-location"
          name="deliveryLocation"
          rows={3}
          maxLength={300}
          placeholder="Quartier, secteur et repère utile"
          required
        />
        <p className="checkout-privacy">
          Le site ne sauvegarde pas ces informations. Elles seront ajoutées au message WhatsApp que vous choisirez d’envoyer.
        </p>
        <button className="primary-button checkout-button" type="submit">
          Ouvrir WhatsApp pour envoyer <span aria-hidden="true">→</span>
        </button>
        <p className="diagnostic-result" role="status" aria-live="polite">{result}</p>
      </form>
    </dialog>
  );
}
