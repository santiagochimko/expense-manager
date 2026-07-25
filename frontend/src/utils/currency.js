export const EXPENSE_CURRENCIES = ["UYU", "USD", "EUR"];

export const currencyLabels = {
  UYU: "UYU",
  USD: "USD",
  EUR: "EUR",
};

export const formatMoney = (amount, currency = "UYU") => {
  const normalizedCurrency = currencyLabels[currency] || currency || "UYU";
  const numericAmount = Number(amount || 0);

  return `${normalizedCurrency} ${numericAmount.toLocaleString("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};