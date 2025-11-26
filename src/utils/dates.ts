export function formatReadableDate(dateString) {
  const date = new Date(dateString);

  const options = {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}