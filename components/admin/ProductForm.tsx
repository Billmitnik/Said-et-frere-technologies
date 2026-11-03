"use client";

import { useActionState, useEffect, useState, type ChangeEvent } from "react";
import { saveProductAction, type ProductFormState } from "@/app/admin/actions";
import { productCategories } from "@/data/categories";

export type EditableProduct = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  badge: string;
  description: string;
  pitch: string | null;
  price: number | null;
  sortOrder: number;
  image: string;
  isActive: boolean;
  isDemo: boolean;
  blendBackground: boolean;
};

type ProductFormProps = {
  product: EditableProduct | null;
  labelSuggestions: string[];
  badgeSuggestions: string[];
};

const MAX_PHOTO_SIDE = 1600;
const TARGET_PHOTO_BYTES = 900_000;

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

// Phone photos are several megabytes; shrink them in the browser so the upload is quick
// and stays under the server limit. Falls back to JPEG where WebP encoding is missing.
async function shrinkPhoto(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  for (const [maxSide, quality] of [[MAX_PHOTO_SIDE, 0.85], [1200, 0.72]] as const) {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) break;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    let blob = await canvasToBlob(canvas, "image/webp", quality);
    if (!blob || blob.type !== "image/webp") {
      context.globalCompositeOperation = "destination-over";
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      blob = await canvasToBlob(canvas, "image/jpeg", quality);
    }
    if (blob && (blob.size <= TARGET_PHOTO_BYTES || maxSide === 1200)) {
      bitmap.close();
      return new File([blob], blob.type === "image/webp" ? "photo.webp" : "photo.jpg", { type: blob.type });
    }
  }
  bitmap.close();
  return file;
}

export function ProductForm({ product, labelSuggestions, badgeSuggestions }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(saveProductAction, null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoStatus, setPhotoStatus] = useState("");
  const [preparingPhoto, setPreparingPhoto] = useState(false);
  const values = state?.values;
  const errors = state?.errors ?? {};

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const original = input.files?.[0];
    if (!original) return;
    setPreparingPhoto(true);
    setPhotoStatus("Préparation de la photo…");
    try {
      const resized = await shrinkPhoto(original);
      const transfer = new DataTransfer();
      transfer.items.add(resized);
      input.files = transfer.files;
      setPreview(URL.createObjectURL(resized));
      setPhotoStatus(`Photo prête (${Math.round(resized.size / 1000)} Ko).`);
    } catch {
      setPreview(URL.createObjectURL(original));
      setPhotoStatus("La photo n’a pas pu être réduite ; elle sera envoyée telle quelle.");
    } finally {
      setPreparingPhoto(false);
    }
  }

  const fieldError = (name: keyof typeof errors) =>
    errors[name] ? <span className="admin-field-error" id={`${name}-error`}>{errors[name]}</span> : null;

  return (
    <form className="admin-card admin-form" action={formAction}>
      {product && <input type="hidden" name="id" value={product.id} />}

      <label>Nom du produit *
        <input name="name" required minLength={2} maxLength={200} defaultValue={values?.name ?? product?.name ?? ""} aria-describedby="name-error" />
        {fieldError("name")}
      </label>

      <div className="admin-form-row">
        <label>Catégorie du menu *
          <select name="category" required defaultValue={values?.category ?? product?.category ?? ""}>
            <option value="" disabled>Choisir…</option>
            {productCategories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
          {fieldError("category")}
        </label>
        <label>Type de produit * <small>affiché sur la fiche</small>
          <input name="categoryLabel" list="label-suggestions" required minLength={2} maxLength={120} placeholder="Ex. Ordinateur portable" defaultValue={values?.categoryLabel ?? product?.categoryLabel ?? ""} />
          <datalist id="label-suggestions">{labelSuggestions.map((label) => <option key={label} value={label} />)}</datalist>
          {fieldError("categoryLabel")}
        </label>
      </div>

      <div className="admin-form-row">
        <label>Prix en F CFA <small>vide = « Sur devis »</small>
          <input name="price" inputMode="numeric" maxLength={14} placeholder="Ex. 185000" defaultValue={values?.price ?? product?.price?.toString() ?? ""} />
          {fieldError("price")}
        </label>
        <label>Étiquette * <small>Ex. NEUF, OCCASION, PROMO</small>
          <input name="badge" list="badge-suggestions" required maxLength={40} defaultValue={values?.badge ?? product?.badge ?? ""} />
          <datalist id="badge-suggestions">{badgeSuggestions.map((badge) => <option key={badge} value={badge} />)}</datalist>
          {fieldError("badge")}
        </label>
      </div>

      <label>Description courte * <small>2 ou 3 phrases, visibles dans le catalogue</small>
        <textarea name="description" required minLength={10} maxLength={600} rows={3} defaultValue={values?.description ?? product?.description ?? ""} />
        {fieldError("description")}
      </label>

      <label>Texte d’accroche <small>facultatif, affiché sur la fiche produit</small>
        <textarea name="pitch" maxLength={1000} rows={3} defaultValue={values?.pitch ?? product?.pitch ?? ""} />
        {fieldError("pitch")}
      </label>

      <div className="admin-photo">
        <img src={preview ?? (product ? `/${product.image}` : "/images/product-placeholder.svg")} alt="" />
        <label>Photo {product ? <small>choisissez-en une pour remplacer l’actuelle</small> : null}
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} />
          <small className="admin-photo-status" role="status">{photoStatus || "JPEG, PNG ou WebP. La photo est réduite automatiquement avant l’envoi."}</small>
          {fieldError("photo")}
        </label>
      </div>

      <div className="admin-form-row">
        <label>Ordre d’affichage <small>plus petit = plus haut ; vide = à la fin</small>
          <input name="sortOrder" inputMode="numeric" maxLength={6} defaultValue={values?.sortOrder ?? product?.sortOrder?.toString() ?? ""} />
          {fieldError("sortOrder")}
        </label>
        <div className="admin-checks">
          <label className="admin-check"><input type="checkbox" name="isActive" defaultChecked={values?.isActive ?? product?.isActive ?? true} /> Visible sur le site</label>
          <label className="admin-check"><input type="checkbox" name="blendBackground" defaultChecked={values?.blendBackground ?? product?.blendBackground ?? false} /> La photo a un fond blanc uni</label>
          <label className="admin-check"><input type="checkbox" name="isDemo" defaultChecked={values?.isDemo ?? product?.isDemo ?? false} /> Produit de démonstration <small>décochez quand le prix et la description sont réels</small></label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button className="primary-button" type="submit" disabled={pending || preparingPhoto}>
          {pending ? "Enregistrement…" : "Enregistrer"} <span aria-hidden="true">✓</span>
        </button>
        <a className="secondary-button" href="/admin">Annuler</a>
      </div>
      <p className="admin-error" role="alert">{state?.message}</p>
    </form>
  );
}
