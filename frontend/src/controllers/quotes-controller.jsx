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
  const quote = filtered[randomIndex];

  console.log("data check:", {
    language,
    dataType: typeof data,
    groups: data?.groups,
    quotes: data?.quotes?.length,
  });

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
