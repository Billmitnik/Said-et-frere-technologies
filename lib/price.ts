export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fr-FR").format(price)} F CFA`;
}
