import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  priceLabel: string;
  quantity: number;
  onOpen: (id: string) => void;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, priceLabel, quantity, onOpen, onAdd }: ProductCardProps) {
  return (
    <article
      className="product-card reveal"
      tabIndex={0}
      aria-label={`Afficher les détails de ${product.name}`}
      aria-haspopup="dialog"
      data-product-card={product.id}
      onClick={() => onOpen(product.id)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(product.id);
        }
      }}
    >
      <div className="product-art">
        <span className="product-badge">{product.badge}</span>
        <img
          className={`product-image${product.blendBackground ? " product-image-blended" : ""}`}
          src={`/${product.image}`}
          alt={product.name}
          height="120"
          onError={(event) => {
            const image = event.currentTarget;
            if (image.dataset.fallbackApplied) return;
            image.dataset.fallbackApplied = "true";
            image.src = "/images/product-placeholder.svg";
          }}
        />
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-bottom">
          <div>
            <div className="product-price">{priceLabel}</div>
            <div className="product-condition">
              {product.price === null ? "Prix à confirmer" : product.isDemo ? "Prix de démonstration" : "Prix affiché"}
            </div>
          </div>
          <div className="product-actions">
            {product.price !== null && (
              <button
                className={`add-button${quantity > 0 ? " has-quantity" : ""}`}
                type="button"
                aria-label={quantity > 0
                  ? `Ajouter encore ${product.name} au panier. Quantité actuelle : ${quantity}`
                  : `Ajouter ${product.name} au panier`}
                title={quantity > 0 ? `${quantity} dans le panier` : "Ajouter au panier"}
                data-add={product.id}
                onClick={(event) => {
                  event.stopPropagation();
                  onAdd(product);
                }}
              >
                {quantity > 0 ? quantity : "+"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
