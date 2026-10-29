const storeWhatsAppNumber = "2250500737519";

export function createWhatsAppUrl(message: string) {
  if (!/^\d{8,15}$/.test(storeWhatsAppNumber)) return null;

  return `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}
