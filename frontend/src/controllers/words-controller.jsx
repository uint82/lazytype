import english from "../data/languages/english.json";
import indonesian from "../data/languages/indonesian.json";

const languageData = {
  english: english,
  indonesian: indonesian,
};

let shuffledWords = {};
let currentIndex = {};

const NUMBER_REGEX = /^\d+$/;
const CONTRACTABLE_REGEX = /^[^\w]*(\w+)[^\w]*$/;

const contractionMap = new Map([
  ["are", ["aren't"]],
  ["can", ["can't"]],
  ["could", ["couldn't"]],
  ["did", ["didn't"]],
  ["does", ["doesn't"]],
  ["do", ["don't"]],
  ["had", ["hadn't"]],
  ["has", ["hasn't"]],
  ["have", ["haven't"]],
  ["is", ["isn't"]],
  ["it", ["it's", "it'll"]],
  ["i", ["i'm", "i'll", "i've", "i'd"]],
  ["you", ["you'll", "you're", "you've", "you'd"]],
  ["that", ["that's", "that'll", "that'd"]],
  ["must", ["mustn't", "must've"]],
  ["there", ["there's", "there'll", "there'd"]],
  ["he", ["he's", "he'll", "he'd"]],
  ["she", ["she's", "she'll", "she'd"]],
  ["we", ["we're", "we'll", "we'd"]],
  ["they", ["they're", "they'll", "they'd"]],
  ["should", ["shouldn't", "should've"]],
  ["was", ["wasn't"]],
  ["were", ["weren't"]],
  ["will", ["won't"]],
  ["would", ["wouldn't", "would've"]],
  ["going", ["goin'"]],
]);

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function punctuateWord(word, lastChar, isLastWord, isFirstWord) {
  const rand = Math.random();

  if (isFirstWord) {
    if (
      (rand >= 0.06 && rand < 0.16 && lastChar !== "." && lastChar !== ",") ||
      isLastWord
    ) {
      const rand2 = Math.random();
      if (rand2 <= 0.8) {
        return word + ".";
      } else if (rand2 < 0.9) {
        return word + "?";
      } else {
        return word + "!";
      }
    }

    if (rand >= 0.16 && rand < 0.36 && lastChar !== ",") {
      return word + ",";
    }

    return word;
  }

  if (rand < 0.01 && lastChar !== "," && lastChar !== ".") {
    return `"${word}"`;
  }

  if (rand >= 0.01 && rand < 0.02 && lastChar !== "," && lastChar !== ".") {
    return `'${word}'`;
  }

  if (rand >= 0.02 && rand < 0.03 && lastChar !== "," && lastChar !== ".") {
    return `(${word})`;
  }

  if (
    rand >= 0.03 &&
    rand < 0.04 &&
    lastChar !== "," &&
    lastChar !== "." &&
    lastChar !== ";" &&
    lastChar !== ":"
  ) {
    return word + ":";
  }

  if (
    rand >= 0.04 &&
    rand < 0.05 &&
    lastChar !== "." &&
    lastChar !== "!" &&
    lastChar !== "?" &&
    lastChar !== ","
  ) {
    return "-";
  }

  if (
    rand >= 0.05 &&
    rand < 0.06 &&
    lastChar !== "," &&
    lastChar !== "." &&
    lastChar !== ";"
  ) {
    return word + ";";
  }

  if (
    (rand >= 0.06 && rand < 0.16 && lastChar !== "." && lastChar !== ",") ||
    isLastWord
  ) {
    const rand2 = Math.random();
    if (rand2 <= 0.8) {
      return word + ".";
    } else if (rand2 < 0.9) {
      return word + "?";
    } else {
      return word + "!";
    }
  }

  if (rand >= 0.16 && rand < 0.36 && lastChar !== ",") {
    return word + ",";
  }

  return word;
}

function addNumbers(word) {
  if (Math.random() < 0.1) {
    const numDigits = Math.floor(Math.random() * 4) + 1;
    let number = "";
    for (let i = 0; i < numDigits; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
  }
  return word;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function applyContraction(word) {
  const match = word.match(CONTRACTABLE_REGEX);
  if (!match) return word;

  const cleanWord = match[1].toLowerCase();
  const contractions = contractionMap.get(cleanWord);

  if (!contractions) return word;

  const replacement =
    contractions[Math.floor(Math.random() * contractions.length)];
  const wasCapitalized = word.charAt(0) === word.charAt(0).toUpperCase();

  return wasCapitalized ? capitalize(replacement) : replacement;
}

/**
 * generates a random list of words with punctuation
 * uses Fisher-Yates shuffle and maintains state for infinite generation
 */
export function getRandomWords(
  count = 75,
  language = "english",
  options = { punctuation: false, numbers: false },
) {
  const data = languageData[language] || english;

  if (
    !shuffledWords[language] ||
    currentIndex[language] >= shuffledWords[language].length
  ) {
    shuffledWords[language] = shuffleArray(data.words);
    currentIndex[language] = 0;
  }

  const selected = [];
  let lastChar = "";
  let shouldCapitalizeNext = options.punctuation;
  const isEnglish = language === "english";

  for (let i = 0; i < count; i++) {
    let word = shuffledWords[language][currentIndex[language]];
    const isLastWord = i === count - 1;
    const isFirstWord = i === 0;

    if (options.numbers) {
      word = addNumbers(word);
    }

    const isNumber = NUMBER_REGEX.test(word);

    if (options.punctuation && !isNumber) {
      word = punctuateWord(word, lastChar, isLastWord, isFirstWord);

      if (
        isEnglish &&
        Math.random() < 0.5 &&
        word !== "-" &&
        contractionMap.has(word.toLowerCase())
      ) {
        word = applyContraction(word);
      }
    }

    if (
      options.punctuation &&
      shouldCapitalizeNext &&
      !isNumber &&
      word !== "-"
    ) {
      word = capitalize(word);
      shouldCapitalizeNext = false;
    }

    if (word.length > 0) {
      lastChar = word[word.length - 1];
      if (
        options.punctuation &&
        (lastChar === "." || lastChar === "!" || lastChar === "?")
      ) {
        shouldCapitalizeNext = true;
      }
    }

    selected.push(word);

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
