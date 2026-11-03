const storeWhatsAppNumber = "2250709531387";

/** International format, e.g. "+2250709531387". */
export const storeTelephone = `+${storeWhatsAppNumber}`;
/** Readable format, e.g. "+225 07 09 53 13 87". */
export const storePhoneLabel = `+${storeWhatsAppNumber.slice(0, 3)} ${storeWhatsAppNumber.slice(3).replace(/(\d{2})(?=\d)/g, "$1 ")}`;

export function createWhatsAppUrl(message: string) {
  if (!/^\d{8,15}$/.test(storeWhatsAppNumber)) return null;

  return `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}
