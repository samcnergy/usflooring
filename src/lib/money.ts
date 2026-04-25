// Money is stored as integer cents everywhere. Display only.

export function centsToDollarString(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const formatted = dollars
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}$${formatted}.${remainder.toString().padStart(2, "0")}`;
}

export function dollarsToCents(input: string | number): number {
  if (typeof input === "number") return Math.round(input * 100);
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!cleaned) return 0;
  const f = Number.parseFloat(cleaned);
  if (Number.isNaN(f)) throw new Error(`Cannot parse money string: ${input}`);
  return Math.round(f * 100);
}
