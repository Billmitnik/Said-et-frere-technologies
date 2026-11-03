import "server-only";

import { productCategories } from "@/data/categories";
import type { ProductCategory } from "@/data/products";
import { getAdminPrisma } from "@/lib/server/prisma";

export const MAX_PHOTO_BYTES = 1_500_000;
const PLACEHOLDER_IMAGE = "images/product-placeholder.svg";
const PHOTO_PATH_PREFIX = "photos/";
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_PRICE = 100_000_000;
const controlCharacters = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

// Legacy columns the storefront no longer displays, kept filled for older code paths.
const categoryArt: Record<ProductCategory, string> = {
  computers: "computer",
  displays: "display",
  accessories: "accessories",
  storage: "storage",
  network: "network",
  bags: "bag",
};

export type ProductFormValues = {
  name: string;
  category: string;
  categoryLabel: string;
  badge: string;
  description: string;
  pitch: string;
  price: string;
  sortOrder: string;
  isActive: boolean;
  isDemo: boolean;
  blendBackground: boolean;
};

export type ProductFormErrors = Partial<Record<keyof ProductFormValues | "photo", string>>;

type ProductInput = {
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  badge: string;
  description: string;
  pitch: string | null;
  price: number | null;
  sortOrder: number | null;
  isActive: boolean;
  isDemo: boolean;
  blendBackground: boolean;
};

type ParsedProductForm =
  | { ok: true; values: ProductFormValues; input: ProductInput; photo: File | null }
  | { ok: false; values: ProductFormValues; errors: ProductFormErrors };

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.replace(controlCharacters, "").trim() : "";
}

function checkLength(errors: ProductFormErrors, key: keyof ProductFormValues, value: string, min: number, max: number, label: string) {
  if (value.length < min) errors[key] = min === 1 ? `${label} est obligatoire.` : `${label} doit faire au moins ${min} caractères.`;
  else if (value.length > max) errors[key] = `${label} ne doit pas dépasser ${max} caractères.`;
}

/** Validates the admin product form on the server; the browser checks are only a convenience. */
export function parseProductForm(formData: FormData): ParsedProductForm {
  const values: ProductFormValues = {
    name: readText(formData, "name"),
    category: readText(formData, "category"),
    categoryLabel: readText(formData, "categoryLabel"),
    badge: readText(formData, "badge"),
    description: readText(formData, "description"),
    pitch: readText(formData, "pitch"),
    price: readText(formData, "price"),
    sortOrder: readText(formData, "sortOrder"),
    isActive: formData.get("isActive") === "on",
    isDemo: formData.get("isDemo") === "on",
    blendBackground: formData.get("blendBackground") === "on",
  };
  const errors: ProductFormErrors = {};

  checkLength(errors, "name", values.name, 2, 200, "Le nom");
  checkLength(errors, "categoryLabel", values.categoryLabel, 2, 120, "Le type de produit");
  checkLength(errors, "badge", values.badge, 1, 40, "L’étiquette");
  checkLength(errors, "description", values.description, 10, 600, "La description");
  checkLength(errors, "pitch", values.pitch, 0, 1000, "Le texte d’accroche");

  const category = productCategories.find((option) => option.id === values.category)?.id;
  if (!category) errors.category = "Choisissez une catégorie.";

  const priceDigits = values.price.replace(/[\s  ]/g, "");
  let price: number | null = null;
  if (priceDigits) {
    if (!/^\d{1,9}$/.test(priceDigits) || Number(priceDigits) > MAX_PRICE) {
      errors.price = "Indiquez un prix en chiffres (par exemple 185000), ou laissez vide pour « Sur devis ».";
    } else {
      price = Number(priceDigits);
    }
  }

  let sortOrder: number | null = null;
  if (values.sortOrder) {
    if (!/^\d{1,6}$/.test(values.sortOrder)) errors.sortOrder = "Indiquez un nombre entier positif.";
    else sortOrder = Number(values.sortOrder);
  }

  const upload = formData.get("photo");
  const photo = upload instanceof File && upload.size > 0 ? upload : null;
  if (photo && photo.size > MAX_PHOTO_BYTES) {
    errors.photo = "La photo est trop lourde (1,5 Mo maximum). Choisissez une image plus petite.";
  }

  if (Object.keys(errors).length > 0 || !category) return { ok: false, values, errors };

  return {
    ok: true,
    values,
    photo,
    input: {
      name: values.name,
      category,
      categoryLabel: values.categoryLabel,
      badge: values.badge.toLocaleUpperCase("fr"),
      description: values.description,
      pitch: values.pitch || null,
      price,
      sortOrder,
      isActive: values.isActive,
      isDemo: values.isDemo,
      blendBackground: values.blendBackground,
    },
  };
}

/** Identifies the image format from its first bytes instead of trusting the browser. */
function detectImageType(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

function slugify(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "") || "produit";
}

export function listAdminProducts(search: string) {
  return getAdminPrisma().product.findMany({
    where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      categoryLabel: true,
      price: true,
      image: true,
      isActive: true,
      isDemo: true,
    },
  });
}

export function getAdminProduct(id: string) {
  return getAdminPrisma().product.findUnique({ where: { id } });
}

/** Labels and badges already in use, offered as suggestions in the product form. */
export async function getProductFormSuggestions() {
  const products = await getAdminPrisma().product.findMany({ select: { categoryLabel: true, badge: true } });
  const sorted = (items: string[]) => [...new Set(items)].sort((a, b) => a.localeCompare(b, "fr"));
  return {
    labelSuggestions: sorted(products.map((product) => product.categoryLabel)),
    badgeSuggestions: sorted(products.map((product) => product.badge)),
  };
}

export type SaveProductResult = { ok: true; id: string } | { ok: false; error: string; field?: "photo" };

export async function saveProduct(existingId: string | null, input: ProductInput, photo: File | null): Promise<SaveProductResult> {
  const prisma = getAdminPrisma();
  const existing = existingId ? await prisma.product.findUnique({ where: { id: existingId } }) : null;
  if (existingId && !existing) return { ok: false, error: "Ce produit n’existe plus." };

  let photoBytes: Uint8Array<ArrayBuffer> | null = null;
  let photoType: string | null = null;
  if (photo) {
    photoBytes = new Uint8Array(await photo.arrayBuffer());
    photoType = detectImageType(photoBytes);
    if (!photoType) return { ok: false, field: "photo", error: "Format de photo non reconnu. Utilisez une photo JPEG, PNG ou WebP." };
  }

  let id = existing?.id;
  if (!id) {
    const base = slugify(input.name);
    const taken = new Set((await prisma.product.findMany({
      where: { id: { startsWith: base } },
      select: { id: true },
    })).map((product) => product.id));
    id = base;
    for (let suffix = 2; taken.has(id); suffix += 1) id = `${base}-${suffix}`;
  }
  const productId = id;

  const sortOrder = input.sortOrder
    ?? existing?.sortOrder
    ?? ((await prisma.product.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? -1) + 1;

  await prisma.$transaction(async (tx) => {
    let image = existing?.image ?? PLACEHOLDER_IMAGE;
    if (photoBytes && photoType) {
      const stored = await tx.productImage.create({
        data: { contentType: photoType, data: photoBytes, byteSize: photoBytes.byteLength },
        select: { id: true },
      });
      image = `${PHOTO_PATH_PREFIX}${stored.id}`;
    }

    const data = {
      name: input.name,
      category: input.category,
      categoryLabel: input.categoryLabel,
      badge: input.badge,
      description: input.description,
      pitch: input.pitch,
      price: input.price,
      art: categoryArt[input.category],
      mark: input.badge.slice(0, 4),
      image,
      blendBackground: input.blendBackground,
      isDemo: input.isDemo,
      isActive: input.isActive,
      sortOrder,
    };
    if (existing) await tx.product.update({ where: { id: productId }, data });
    else await tx.product.create({ data: { id: productId, ...data } });

    // Remove the replaced photo unless another product still shows it.
    const previousImage = existing?.image;
    const previousPhotoId = previousImage?.startsWith(PHOTO_PATH_PREFIX) ? previousImage.slice(PHOTO_PATH_PREFIX.length) : null;
    if (previousImage && previousImage !== image && previousPhotoId && UUID_PATTERN.test(previousPhotoId)) {
      const stillUsed = await tx.product.count({ where: { image: previousImage } });
      if (stillUsed === 0) await tx.productImage.deleteMany({ where: { id: previousPhotoId } });
    }
  });

  return { ok: true, id: productId };
}

export async function setProductActive(id: string, isActive: boolean) {
  await getAdminPrisma().product.updateMany({ where: { id }, data: { isActive } });
}

export async function hideDemoProducts() {
  const result = await getAdminPrisma().product.updateMany({
    where: { isDemo: true, isActive: true },
    data: { isActive: false },
  });
  return result.count;
}
