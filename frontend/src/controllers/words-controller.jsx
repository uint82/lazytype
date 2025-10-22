import english from "../data/languages/english.json";

/**
 * generates a random list of unique words using Fisher–Yates shuffle
 */
export function getRandomWords(count = 500) {
  const wordList = [...english.words];
  for (let i = wordList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordList[i], wordList[j]] = [wordList[j], wordList[i]];
  }
  const selected = [];
  for (let i = 0; i < count; i++) {
    selected.push(wordList[i % wordList.length]);
  }
  return selected.join(" ");
}
