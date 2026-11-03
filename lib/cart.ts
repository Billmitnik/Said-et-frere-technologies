// The cart lives in the visitor's browser only (localStorage), shared by the shop and
// the product pages.
export type Cart = Record<string, number>;

const CART_STORAGE_KEY = "said-freres-cart-v1";
export const MAX_CART_ITEMS = 999;
const MAX_STORED_CART_LENGTH = 20_000;

export function emptyCart(): Cart {
  return Object.create(null) as Cart;
}

export function cartItemCount(cart: Cart) {
  return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

export function readStoredCart(isKnownProduct: (id: string) => boolean): Cart {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw || raw.length > MAX_STORED_CART_LENGTH) return emptyCart();

    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return emptyCart();

    const cart = emptyCart();
    let totalItems = 0;
    for (const [id, quantity] of Object.entries(stored)) {
      if (!isKnownProduct(id) || typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity <= 0 || quantity > MAX_CART_ITEMS) {
        continue;
      }
      if (totalItems + quantity > MAX_CART_ITEMS) break;
      cart[id] = quantity;
      totalItems += quantity;
    }
    return cart;
  } catch {
    return emptyCart();
  }
}

/** Returns false when the browser refused to save the cart. */
export function writeStoredCart(cart: Cart) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch {
    return false;
  }
}
