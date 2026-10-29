"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CartDialog } from "@/components/shop/CartDialog";
import { CheckoutDialog } from "@/components/shop/CheckoutDialog";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductDialog } from "@/components/shop/ProductDialog";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { Product, ProductCategory } from "@/data/products";

type CategoryFilter = ProductCategory | "all";
type Cart = Record<string, number>;

type ShopClientProps = {
  products: Product[];
  afterCatalog: ReactNode;
};

const CART_STORAGE_KEY = "said-freres-cart-v1";
const MAX_CART_ITEMS = 999;
const MAX_STORED_CART_LENGTH = 20_000;
const PAGE_SIZE = 12;

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fr-FR").format(price)} F CFA`;
}

function loadCart(products: Product[]): Cart {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw || raw.length > MAX_STORED_CART_LENGTH) return Object.create(null) as Cart;

    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
      return Object.create(null) as Cart;
    }

    const nextCart: Cart = Object.create(null) as Cart;
    let totalItems = 0;
    for (const [id, quantity] of Object.entries(stored)) {
      const product = products.find((item) => item.id === id && item.price !== null);
      if (!product || !Number.isSafeInteger(quantity) || typeof quantity !== "number" || quantity <= 0 || quantity > MAX_CART_ITEMS) {
        continue;
      }
      if (totalItems + quantity > MAX_CART_ITEMS) break;
      nextCart[id] = quantity;
      totalItems += quantity;
    }
    return nextCart;
  } catch {
    return Object.create(null) as Cart;
  }
}

function Hero() {
  const [pointerEffectsEnabled, setPointerEffectsEnabled] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const lastRipple = useRef(0);

  useEffect(() => {
    const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPointerEffectsEnabled(hoverPointer && !reducedMotion);
  }, []);

  return (
    <section
      className={`hero${pointerActive ? " pointer-active" : ""}`}
      id="accueil"
      onPointerMove={(event) => {
        if (!pointerEffectsEnabled || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
        event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
        setPointerActive(true);

        const now = performance.now();
        if (lastRipple.current && now - lastRipple.current < 180) return;
        lastRipple.current = now;
        setRippleKey((key) => key + 1);
      }}
      onPointerLeave={() => setPointerActive(false)}
    >
      <span
        key={rippleKey}
        className={`hero-water-ripple${rippleKey > 0 ? " is-rippling" : ""}`}
        aria-hidden="true"
      />
      <div className="hero-copy reveal">
        <p className="eyebrow"><span className="live-dot" /> Votre partenaire informatique à Bouaké</p>
        <h1>La tech qu’il vous faut.<br /><span>À Bouaké.</span></h1>
        <p>
          Besoin d’un PC qui suit vos ambitions ? Découvrez chez Saïd Technologies des ordinateurs,
          des accessoires et des solutions pour donner vie au setup que vous imaginez.
        </p>
        <p className="hero-location">
          <span aria-hidden="true">⌖</span> Retrouvez-nous au Centre commercial Capitole, à Bouaké.
        </p>
        <a className="primary-button" href="#boutique">
          Explorer la boutique <span aria-hidden="true">↘</span>
        </a>
        <div className="hero-assurance">
          <span><b>01</b> Trouvez votre équipement</span>
          <span><b>02</b> Composez votre setup</span>
        </div>
      </div>
      <div className="hero-visual reveal">
        <div className="hero-orbit orbit-a" />
        <div className="hero-orbit orbit-b" />
        <div className="hero-laptop">
          <img
            className="macbook-display"
            src="/images/macbook-display.png"
            alt="MacBook ouvert vu de face, avec écran noir et clavier intégré."
            width="501"
            height="306"
          />
        </div>
        <span className="visual-caption">LA TECHNOLOGIE, EN TOUTE CONFIANCE.</span>
      </div>
    </section>
  );
}

export function ShopClient({ products, afterCatalog }: ShopClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [cart, setCart] = useState<Cart>(() => Object.create(null) as Cart);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const revealObserver = useRef<IntersectionObserver | null>(null);

  const matchingProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const searchable = `${product.name} ${product.categoryLabel} ${product.pitch ?? product.description} ${product.badge}`
        .toLocaleLowerCase("fr");
      return matchesCategory && searchable.includes(query);
    });
  }, [products, search, selectedCategory]);

  const visibleProducts = matchingProducts.slice(0, visibleCount);
  const cartEntries = useMemo(
    () => Object.entries(cart)
      .map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity }))
      .filter((entry): entry is { product: Product; quantity: number } =>
        entry.product !== undefined && entry.product.price !== null),
    [cart, products],
  );
  const cartCount = cartEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const cartTotal = cartEntries.reduce((sum, entry) => sum + (entry.product.price ?? 0) * entry.quantity, 0);
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null;
  const isDemoCatalog = products.length > 0 && products.every((product) => product.isDemo);

  useEffect(() => {
    setCart(loadCart(products));
    setCartReady(true);
  }, [products]);

  useEffect(() => {
    if (!cartReady) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      setToastMessage("Le navigateur n’a pas pu enregistrer votre panier.");
    }
  }, [cart, cartReady]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".product-card.reveal").forEach((card) => card.classList.add("is-visible"));
      return;
    }

    document.body.classList.add("js-ready");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    revealObserver.current = observer;
    document.querySelectorAll(".hero-copy.reveal, .hero-visual.reveal, .section-top.reveal, .service-symbol.reveal, .promise-section > .reveal, .product-card.reveal")
      .forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      revealObserver.current = null;
      document.body.classList.remove("js-ready");
    };
  }, []);

  useEffect(() => {
    const observer = revealObserver.current;
    const cards = document.querySelectorAll(".product-card.reveal");
    if (observer) cards.forEach((card) => observer.observe(card));
    else cards.forEach((card) => card.classList.add("is-visible"));
  }, [visibleProducts]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  function scrollToCatalog() {
    document.querySelector("#boutique")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  function updateSearch(value: string) {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateCategory(category: CategoryFilter) {
    setSelectedCategory(category);
    setVisibleCount(PAGE_SIZE);
    scrollToCatalog();
  }

  function addProduct(product: Product) {
    if (product.price === null) return;
    const currentCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
    if (currentCount >= MAX_CART_ITEMS) {
      setToastMessage("Votre panier a atteint sa limite. Contactez la boutique pour une commande importante.");
      return;
    }
    setCart((current) => ({ ...current, [product.id]: Math.min((current[product.id] ?? 0) + 1, MAX_CART_ITEMS) }));
    setToastMessage(`${product.name} ajouté au panier.`);
  }

  function changeQuantity(id: string, change: number) {
    const currentCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
    if (change > 0 && currentCount >= MAX_CART_ITEMS) {
      setToastMessage("Votre panier a atteint sa limite. Contactez la boutique pour une commande importante.");
      return;
    }
    setCart((current) => {
      const nextQuantity = (current[id] ?? 0) + change;
      const next = { ...current };
      if (nextQuantity <= 0) delete next[id];
      else next[id] = Math.min(nextQuantity, MAX_CART_ITEMS);
      return next;
    });
  }

  return (
    <>
      <SiteHeader
        cartCount={cartCount}
        search={search}
        selectedCategory={selectedCategory}
        onSearchChange={updateSearch}
        onSearchSubmit={scrollToCatalog}
        onCategoryChange={updateCategory}
        onOpenCart={() => setCartOpen(true)}
      />
      <main>
        <Hero />
        <section className="shop-section" id="boutique">
          <div className="section-top reveal">
            <div><h2>Tout pour votre<br />univers numérique.</h2></div>
            <p className="section-intro">
              Votre prochain ordinateur, l’accessoire qui manque ou le setup dont vous rêvez : trouvez votre prochaine pièce tech chez Saïd.
            </p>
          </div>
          {isDemoCatalog ? (
            <p className="sample-note">
              Catalogue élargi de démonstration. Les modèles, marques, caractéristiques, disponibilités et prix sont fictifs et devront être confirmés par Saïd.
            </p>
          ) : null}
          <p className="results-count" id="results-count" aria-live="polite">
            {matchingProducts.length
              ? `Affichage de ${visibleProducts.length} article${visibleProducts.length > 1 ? "s" : ""} sur ${matchingProducts.length}`
              : "0 article trouvé"}
          </p>
          <div className="product-grid" id="product-grid" aria-live="polite">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                priceLabel={product.price === null ? "Sur devis" : formatPrice(product.price)}
                quantity={cart[product.id] ?? 0}
                onOpen={setSelectedProductId}
                onAdd={addProduct}
              />
            ))}
          </div>
          {matchingProducts.length === 0 ? (
            <p className="empty-state">Aucun article ne correspond à cette recherche.</p>
          ) : null}
          {visibleProducts.length < matchingProducts.length ? (
            <button className="load-more-button" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
              Afficher plus d’articles <span aria-hidden="true">↓</span>
            </button>
          ) : null}
        </section>
        {afterCatalog}
      </main>
      <CartDialog
        open={cartOpen}
        entries={cartEntries}
        count={cartCount}
        total={cartTotal}
        formatPrice={formatPrice}
        onClose={() => setCartOpen(false)}
        onQuantityChange={changeQuantity}
        onRemove={(id) => setCart((current) => {
          const next = { ...current };
          delete next[id];
          return next;
        })}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutDialog
        open={checkoutOpen}
        entries={cartEntries}
        total={cartTotal}
        formatPrice={formatPrice}
        onClose={() => setCheckoutOpen(false)}
      />
      <ProductDialog
        product={selectedProduct}
        formatPrice={formatPrice}
        onClose={() => setSelectedProductId(null)}
        onAdd={addProduct}
      />
      <div className={`toast${toastMessage ? " visible" : ""}`} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </>
  );
}
