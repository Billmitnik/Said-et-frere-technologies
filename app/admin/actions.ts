"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, signIn, signOut } from "@/lib/server/admin/auth";
import {
  hideDemoProducts,
  parseProductForm,
  saveProduct,
  setProductActive,
  type ProductFormErrors,
  type ProductFormValues,
} from "@/lib/server/admin/products";
import { CATALOG_CACHE_TAG } from "@/lib/server/catalog";

// Every action checks the session itself: Server Actions can be called by a direct POST.

export type LoginState = { error: string } | null;

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  const result = await signIn(typeof password === "string" ? password : "");
  if (result === "locked") return { error: "Trop de tentatives. Patientez 15 minutes avant de réessayer." };
  if (result === "unconfigured") return { error: "L’administration n’est pas encore configurée sur ce site." };
  if (result === "invalid") return { error: "Mot de passe incorrect." };
  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/admin/connexion");
}

export type ProductFormState = {
  values?: ProductFormValues;
  errors?: ProductFormErrors;
  message?: string;
} | null;

export async function saveProductAction(_state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const existingId = formData.get("id");
  const parsed = parseProductForm(formData);
  if (!parsed.ok) {
    return { values: parsed.values, errors: parsed.errors, message: "Corrigez les champs indiqués en rouge." };
  }

  const result = await saveProduct(typeof existingId === "string" && existingId ? existingId : null, parsed.input, parsed.photo);
  if (!result.ok) {
    return {
      values: parsed.values,
      errors: result.field ? { [result.field]: result.error } : undefined,
      message: result.error,
    };
  }

  updateTag(CATALOG_CACHE_TAG);
  redirect(`/admin?enregistre=${encodeURIComponent(result.id)}`);
}

export async function setProductActiveAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;
  await setProductActive(id, formData.get("isActive") === "true");
  updateTag(CATALOG_CACHE_TAG);
  refresh();
}

export async function hideDemoProductsAction() {
  await requireAdmin();
  const hidden = await hideDemoProducts();
  updateTag(CATALOG_CACHE_TAG);
  redirect(`/admin?demo-masques=${hidden}`);
}
