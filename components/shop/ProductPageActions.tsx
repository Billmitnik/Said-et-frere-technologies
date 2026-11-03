"use client";

import { useState } from "react";
import { cartItemCount, MAX_CART_ITEMS, readStoredCart, writeStoredCart } from "@/lib/cart";
import { createWhatsAppUrl } from "@/lib/whatsapp";

type ProductPageActionsProps = {
  productId: string;
  productName: string;
  priceLabel: string;
  canOrder: boolean;
  pageUrl: string;
};

export function ProductPageActions({ productId, productName, priceLabel, canOrder, pageUrl }: ProductPageActionsProps) {
  const [status, setStatus] = useState<{ message: string; showCartLink: boolean } | null>(null);
  const inquiryUrl = createWhatsAppUrl(
    `Bonjour SAID & FRÈRES TECHNOLOGIES, je suis intéressé(e) par « ${productName} » (${priceLabel}). Est-il disponible ?\n${pageUrl}`,
  );

  function addToCart() {
    // The shop page drops unknown or unpriced products when it loads the cart.
    const cart = readStoredCart(() => true);
    if (cartItemCount(cart) >= MAX_CART_ITEMS) {
      setStatus({ message: "Votre panier a atteint sa limite. Contactez la boutique pour une commande importante.", showCartLink: true });
      return;
    }
    cart[productId] = (cart[productId] ?? 0) + 1;
    setStatus(writeStoredCart(cart)
      ? { message: `${productName} ajouté au panier (quantité : ${cart[productId]}).`, showCartLink: true }
      : { message: "Le navigateur n’a pas pu enregistrer votre panier.", showCartLink: false });
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: productName, url: pageUrl });
        return;
      }
      await navigator.clipboard.writeText(pageUrl);
      setStatus({ message: "Lien copié. Vous pouvez le coller dans WhatsApp ou un SMS.", showCartLink: false });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus({ message: `Copiez ce lien pour le partager : ${pageUrl}`, showCartLink: false });
    }
  }

  return (
    <div className="product-page-actions">
      {canOrder ? (
        <button className="primary-button" type="button" onClick={addToCart}>
          Ajouter au panier <span aria-hidden="true">+</span>
        </button>
      ) : (
        <a className="primary-button" href="/maintenance#diagnostic">
          Décrire mon problème
        </a>
      )}
      {inquiryUrl && (
        <a className="secondary-button" href={inquiryUrl}>
          Demander sur WhatsApp
        </a>
      )}
      <button className="secondary-button" type="button" onClick={share}>
        Partager
      </button>
      <p className="product-page-status" role="status" aria-live="polite">
        {status?.message}
        {status?.showCartLink && <> <a href="/#panier">Voir le panier</a></>}
      </p>
    </div>
  );
}
