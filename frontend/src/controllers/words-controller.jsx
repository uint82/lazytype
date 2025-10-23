import english from "../data/languages/english.json";

let shuffledWords = null;
let currentIndex = 0;

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
export function getRandomWords(count = 50) {
  if (!shuffledWords || currentIndex >= shuffledWords.length) {
    shuffledWords = shuffleArray(english.words);
    currentIndex = 0;
  }

  const selected = [];
  for (let i = 0; i < count; i++) {
    selected.push(shuffledWords[currentIndex]);
    currentIndex = (currentIndex + 1) % shuffledWords.length;

    if (currentIndex === 0 && i < count - 1) {
      shuffledWords = shuffleArray(english.words);
    }
  }

  return selected.join(" ");
}

export function resetWordGenerator() {
  shuffledWords = null;
  currentIndex = 0;
}
