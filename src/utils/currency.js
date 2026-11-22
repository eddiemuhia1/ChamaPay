export function convertFromKES(amountKES, rate) {
  const amount = Number(amountKES);
  if (!Number.isFinite(amount) || typeof rate !== "number" || !Number.isFinite(rate)) {
    return 0;
  }
  return Math.round(amount * rate * 100) / 100;
}

export function getRate(rates, currency) {
  if (!rates || typeof rates[currency] !== "number") return 0;
  return rates[currency];
}

export function isRatesResponseValid(data) {
  return Boolean(data) && data.result === "success" && typeof data.rates === "object" && data.rates !== null;
}
