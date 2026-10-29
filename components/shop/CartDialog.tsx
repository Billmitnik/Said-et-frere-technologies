"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/data/products";

export type CartEntry = {
  product: Product;
  quantity: number;
};

type CartDialogProps = {
  open: boolean;
  entries: CartEntry[];
  count: number;
  total: number;
  formatPrice: (price: number) => string;
  onClose: () => void;
  onQuantityChange: (id: string, change: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
};

export function CartDialog({
  open,
  entries,
  count,
  total,
  formatPrice,
  onClose,
  onQuantityChange,
  onRemove,
  onCheckout,
}: CartDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="cart-dialog"
      id="cart-dialog"
      aria-labelledby="cart-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className="dialog-heading">
        <div>
          <p className="eyebrow eyebrow-dark">Votre sélection</p>
          <h2 id="cart-title">Votre panier <span>({count})</span></h2>
        </div>
        <button className="icon-button" id="close-cart" type="button" aria-label="Fermer le panier" onClick={() => dialogRef.current?.close()}>
          ×
        </button>
      </div>
      <div className="cart-lines">
        {entries.map(({ product, quantity }) => (
          <article className="cart-line" key={product.id}>
            <div>
              <h3>{product.name}</h3>
              <span>{formatPrice(product.price ?? 0)} · prix indicatif</span>
            </div>
            <div className="cart-line-right">
              <strong>{formatPrice((product.price ?? 0) * quantity)}</strong>
              <div className="quantity-controls" aria-label={`Quantité de ${product.name}`}>
                <button type="button" aria-label={`Retirer un ${product.name}`} onClick={() => onQuantityChange(product.id, -1)}>−</button>
                <span>{quantity}</span>
                <button type="button" aria-label={`Ajouter un ${product.name}`} onClick={() => onQuantityChange(product.id, 1)}>+</button>
                <button className="remove-item" type="button" aria-label={`Supprimer ${product.name} du panier`} onClick={() => onRemove(product.id)}>
                  <span aria-hidden="true">×</span> Supprimer
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {count === 0 ? (
        <div className="cart-empty">
          Votre panier est encore vide.<br />
          <a href="#boutique" onClick={() => dialogRef.current?.close()}>
            Découvrir la boutique →
          </a>
        </div>
      ) : (
        <div className="cart-summary">
          <div><span>Total indicatif</span><strong>{formatPrice(total)}</strong></div>
          <p>Montant calculé sur les prix de démonstration, à confirmer en boutique.</p>
          <button className="primary-button checkout-button" id="open-checkout" type="button" onClick={onCheckout}>
            Commander sur WhatsApp <span aria-hidden="true">→</span>
          </button>
          <p className="payment-warning">
            La boutique confirmera le prix, la disponibilité et les modalités de livraison sur WhatsApp. Paiement à la livraison.
          </p>
        </div>
      )}
    </dialog>
  );
}
