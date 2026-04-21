export function formatMoney(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(pence / 100);
}

export function penceToPounds(pence: number): string {
  return (pence / 100).toFixed(2);
}

export function poundsToPence(pounds: string | number): number {
  return Math.round(Number(pounds) * 100);
}
