"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/data/products";

type ProductDialogProps = {
  product: Product | null;
  formatPrice: (price: number) => string;
  onClose: () => void;
  onAdd: (product: Product) => void;
};

export function ProductDialog({ product, formatPrice, onClose, onAdd }: ProductDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  return (
    <dialog
      ref={dialogRef}
      className="product-dialog"
      id="product-dialog"
      aria-labelledby="product-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <button className="icon-button product-dialog-close" id="close-product" type="button" aria-label="Fermer les détails" onClick={() => dialogRef.current?.close()}>
        ×
      </button>
      {product && (
        <div className="product-dialog-content">
          <div className="product-dialog-art product-art">
            <span className="product-badge">{product.badge}</span>
            <img
              className={`product-image${product.blendBackground ? " product-image-blended" : ""}`}
              src={`/${product.image}`}
              alt={product.name}
              height="300"
              onError={(event) => {
                const image = event.currentTarget;
                if (image.dataset.fallbackApplied) return;
                image.dataset.fallbackApplied = "true";
                image.src = "/images/product-placeholder.svg";
              }}
            />
          </div>
          <div className="product-dialog-info">
            <p className="product-category">{product.categoryLabel}</p>
            <h2 id="product-dialog-title">{product.name}</h2>
            <p>{product.description}</p>
            {product.pitch ? <p>{product.pitch}</p> : null}
            <p>Les références exactes et les caractéristiques sont à confirmer auprès de Saïd selon le stock disponible.</p>
            <div className="product-dialog-price">
              {product.price === null ? "Sur devis" : formatPrice(product.price)}
            </div>
            <p className="product-dialog-note">
              {product.price === null
                ? "Le tarif dépend du diagnostic et de la prestation."
                : product.isDemo
                  ? "Prix de démonstration uniquement — à confirmer en boutique."
                  : "Le prix est à confirmer auprès de la boutique selon le stock disponible."}
            </p>
            {product.price === null ? (
              <>
                <p className="product-dialog-unavailable">
                  Décrivez votre besoin dans la rubrique maintenance pour préparer une demande de diagnostic.
                </p>
                <a className="primary-button" href="/maintenance#diagnostic" onClick={onClose}>
                  Décrire mon problème <span aria-hidden="true">→</span>
                </a>
              </>
            ) : (
              <button className="primary-button" type="button" onClick={() => onAdd(product)}>
                Ajouter au panier <span aria-hidden="true">+</span>
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
