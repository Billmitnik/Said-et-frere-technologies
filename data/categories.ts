import type { ProductCategory } from "@/data/products";

/** Category menu labels, in display order. Kept apart from the demo catalog so client code stays small. */
export const productCategories: Array<{ id: ProductCategory; label: string }> = [
  { id: "computers", label: "Ordinateurs" },
  { id: "displays", label: "Écrans" },
  { id: "accessories", label: "Accessoires & setup" },
  { id: "storage", label: "Disques & composants" },
  { id: "network", label: "Réseau & énergie" },
  { id: "bags", label: "Sacs & transport" },
];
