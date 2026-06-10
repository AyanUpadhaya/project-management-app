export function truncateText(text:string, maxLength = 100, suffix = "...") {
  if (!text || typeof text !== "string") return "";

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trimEnd() + suffix;
}
