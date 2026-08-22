import clsx from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatPrice(amount, currency = "INR", locale = "en-IN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date, options = {}) {
  const value = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(value);
}
