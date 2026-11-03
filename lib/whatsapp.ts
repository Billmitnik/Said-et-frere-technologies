const storeWhatsAppNumber = "2250500737519";

/** International format, e.g. "+2250500737519". */
export const storeTelephone = `+${storeWhatsAppNumber}`;
/** Readable format, e.g. "+225 05 00 73 75 19". */
export const storePhoneLabel = `+${storeWhatsAppNumber.slice(0, 3)} ${storeWhatsAppNumber.slice(3).replace(/(\d{2})(?=\d)/g, "$1 ")}`;

export function createWhatsAppUrl(message: string) {
  if (!/^\d{8,15}$/.test(storeWhatsAppNumber)) return null;

  return `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}
