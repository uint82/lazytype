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
  const groups = data?.groups ?? [];
  const [min, max] =
    selectedGroupIndex !== null && groups[selectedGroupIndex]
      ? groups[selectedGroupIndex]
      : [0, Infinity];
  const filtered = data.quotes.filter(
    (q) => q.length >= min && q.length <= max,
  );
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  let actualGroup = groupIndex;
  // if "all" was selected (groupIndex null), return which group was actually used
  // the UI expects: null=all, 0=short, 1=medium, 2=long, 3=very long
  // but data.groups is: 0=short, 1=medium, 2=long, 3=very long
  // so we just return selectedGroupIndex as-is since it matches the UI indices
  if (groupIndex === null) {
    actualGroup = selectedGroupIndex;
  }
  return { quote, actualGroup };
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

export function getQuotes(language = "english") {
  const data = languageData[language] || englishData;
  return data.quotes || [];
}

export function getQuoteById(id, language = "english") {
  const data = languageData[language] || englishData;
  const quote = data.quotes.find((q) => q.id === id);

  if (!quote) return null;

  const groups = data?.groups ?? [];
  let groupIndex = null;

  for (let i = 0; i < groups.length; i++) {
    const [min, max] = groups[i];
    if (quote.length >= min && quote.length <= max) {
      groupIndex = i;
      break;
    }
  }

  return {
    ...quote,
    group: groupIndex,
  };
}
