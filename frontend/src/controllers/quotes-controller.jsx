import englishData from "../data/quotes/english.json";
import indonesianData from "../data/quotes/indonesian.json";

const languageData = {
  english: englishData,
  indonesian: indonesianData,
};

export function getRandomQuote(groupIndex = null, language = "english") {
  const data = languageData[language] || englishData;
  let selectedGroupIndex = groupIndex;

  if (groupIndex === null) {
    selectedGroupIndex = Math.floor(Math.random() * data.groups.length);
  }

  const [min, max] =
    selectedGroupIndex !== null
      ? data.groups[selectedGroupIndex]
      : [0, Infinity];

  const filtered = data.quotes.filter(
    (q) => q.length >= min && q.length <= max,
  );

  if (filtered.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getQuoteGroups(language = "english") {
  const data = languageData[language] || englishData;
  const labels = ["All", "Short", "Medium", "Long", "Very Long"];
  const groups = data.groups.map((range, index) => ({
    index,
    label: labels[index + 1] || `Group ${index + 1}`,
    range,
  }));

  return [{ index: null, label: labels[0], range: null }, ...groups];
}
