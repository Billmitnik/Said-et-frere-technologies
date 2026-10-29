"use client";

import type { FormEvent } from "react";
import { Brand } from "@/components/site/Brand";
import type { ProductCategory } from "@/data/products";

type CategoryFilter = ProductCategory | "all";

type SiteHeaderProps = {
  cartCount: number;
  search: string;
  selectedCategory: CategoryFilter;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onOpenCart: () => void;
};

const categories: Array<{ id: CategoryFilter; label: string }> = [
  { id: "all", label: "☰ Tout le catalogue" },
  { id: "computers", label: "Ordinateurs" },
  { id: "displays", label: "Écrans" },
  { id: "accessories", label: "Accessoires & setup" },
  { id: "storage", label: "Disques & composants" },
  { id: "network", label: "Réseau & énergie" },
];

export function SiteHeader({
  cartCount,
  search,
  selectedCategory,
  onSearchChange,
  onSearchSubmit,
  onCategoryChange,
  onOpenCart,
}: SiteHeaderProps) {
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearchSubmit();
  }

  return (
    <header className="site-header">
      <div className="header-main">
        <Brand href="#accueil" label="SAID & Frères Technologies, accueil" />
        <form className="header-search" role="search" onSubmit={submitSearch}>
          <label className="visually-hidden" htmlFor="header-search-input">
            Rechercher dans la boutique
          </label>
          <input
            id="header-search-input"
            type="search"
            placeholder="Ordinateur, écran, disque dur…"
            autoComplete="off"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
          />
          <button type="submit" aria-label="Rechercher">⌕</button>
        </form>
        <div className="header-actions">
          <a className="help-link" href="/maintenance#diagnostic">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M4 13v-2a8 8 0 0 1 16 0v2M4 12H3v4h4v-4H4Zm16 0h1v4h-4v-4h3Zm0 5c-.7 2-2.5 3-5 3" />
            </svg>
            <span>Assistance</span>
          </a>
          <button
            className="cart-trigger"
            id="open-cart"
            type="button"
            aria-label="Ouvrir le panier"
            onClick={onOpenCart}
          >
            <svg className="cart-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L22 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span>Panier</span>
            <span className="cart-count" id="cart-count">{cartCount}</span>
          </button>
        </div>
      </div>
      <nav className="category-nav" aria-label="Catégories et navigation">
        {categories.map((category) => (
          <a
            key={category.id}
            className={category.id === "all" ? "category-nav-home" : undefined}
            href="#boutique"
            data-header-category={category.id}
            aria-current={selectedCategory === category.id ? "true" : undefined}
            onClick={(event) => {
              event.preventDefault();
              onCategoryChange(category.id);
            }}
          >
            {category.id === "all" ? (
              <><span aria-hidden="true">☰</span><span>Tout le catalogue</span></>
            ) : category.label}
          </a>
        ))}
        <a href="/maintenance#diagnostic">Maintenance</a>
        <a href="#a-propos">À propos</a>
      </nav>
    </header>
  );
}
