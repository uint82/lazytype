import english from "../data/languages/english.json";
import indonesian from "../data/languages/indonesian.json";

const languageData = {
  english: english,
  indonesian: indonesian,
};

let shuffledWords = {};
let currentIndex = {};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a random list of words
 * Uses Fisher-Yates shuffle and maintains state for infinite generation
 */
export function getRandomWords(count = 50, language = "english") {
  const data = languageData[language] || english;

  if (
    !shuffledWords[language] ||
    currentIndex[language] >= shuffledWords[language].length
  ) {
    shuffledWords[language] = shuffleArray(data.words);
    currentIndex[language] = 0;
  }

  const selected = [];
  for (let i = 0; i < count; i++) {
    selected.push(shuffledWords[language][currentIndex[language]]);
    currentIndex[language] =
      (currentIndex[language] + 1) % shuffledWords[language].length;

    if (currentIndex[language] === 0 && i < count - 1) {
      shuffledWords[language] = shuffleArray(data.words);
    }
  }

  return selected.join(" ");
}

export function resetWordGenerator(language = null) {
  if (language) {
    shuffledWords[language] = null;
    currentIndex[language] = 0;
  } else {
    shuffledWords = {};
    currentIndex = {};
  }
}
