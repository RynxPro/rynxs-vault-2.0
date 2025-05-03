export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatFollowNumber(number: number | null | undefined) {
  if (number == null) return "0";
  return number.toLocaleString("en-US");
}

export function formatViewNumber(number: number | null | undefined) {
  if (number == null) return "0";
  if (number < 1000) return number.toString();
  if (number < 10000)
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (number < 1000000) return Math.floor(number / 1000) + "K";
  return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
}

export function cn(...inputs: (string | false | null | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}
