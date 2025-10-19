import englishData from "../data/quotes/english.json";

export function getRandomQuote(groupIndex = null) {
  let selectedGroupIndex = groupIndex;

  if (groupIndex === null) {
    selectedGroupIndex = Math.floor(Math.random() * englishData.groups.length);
  }

  const [min, max] =
    selectedGroupIndex !== null
      ? englishData.groups[selectedGroupIndex]
      : [0, Infinity];

  const filtered = englishData.quotes.filter(
    (q) => q.length >= min && q.length <= max,
  );

  if (filtered.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getQuoteGroups() {
  const labels = ["All", "Short", "Medium", "Long", "Very Long"];
  const groups = englishData.groups.map((range, index) => ({
    index,
    label: labels[index + 1] || `Group ${index + 1}`,
    range,
  }));

  return [{ index: null, label: labels[0], range: null }, ...groups];
}
