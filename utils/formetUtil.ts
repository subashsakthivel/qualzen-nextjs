export function getCurrencyFormet(price: number) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(price);

  return formatted;
}
