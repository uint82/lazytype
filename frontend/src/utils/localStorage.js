const STORAGE_KEYS = {
  MODE: "lazytype_mode",
  GROUP: "lazytype_group",
  DURATION: "lazytype_duration",
  WORD_COUNT: "lazytype_word_count",
  LANGUAGE: "lazytype_language",
  PUNCTUATION: "lazytype_punctuation",
  NUMBERS: "lazytype_numbers",
};

const DEFAULTS = {
  MODE: "quotes",
  GROUP: null,
  DURATION: 60,
  WORD_COUNT: 25,
  LANGUAGE: "english",
  PUNCTUATION: false,
  NUMBERS: false,
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
};

export const saveTestConfig = (config) => {
  saveToStorage(STORAGE_KEYS.MODE, config.mode);
  saveToStorage(STORAGE_KEYS.GROUP, config.group);
  saveToStorage(STORAGE_KEYS.DURATION, config.duration);
  saveToStorage(STORAGE_KEYS.WORD_COUNT, config.word_count);
  saveToStorage(STORAGE_KEYS.LANGUAGE, config.language);
  saveToStorage(STORAGE_KEYS.PUNCTUATION, config.punctuation);
  saveToStorage(STORAGE_KEYS.NUMBERS, config.numbers);
};

export const loadTestConfig = () => {
  return {
    mode: getFromStorage(STORAGE_KEYS.MODE, DEFAULTS.MODE),
    group: getFromStorage(STORAGE_KEYS.GROUP, DEFAULTS.GROUP),
    duration: getFromStorage(STORAGE_KEYS.DURATION, DEFAULTS.DURATION),
    word_count: getFromStorage(STORAGE_KEYS.WORD_COUNT, DEFAULTS.WORD_COUNT),
    language: getFromStorage(STORAGE_KEYS.LANGUAGE, DEFAULTS.LANGUAGE),
    punctuation: getFromStorage(STORAGE_KEYS.PUNCTUATION, DEFAULTS.PUNCTUATION),
    numbers: getFromStorage(STORAGE_KEYS.NUMBERS, DEFAULTS.NUMBERS),
  };
};

export const clearTestConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MODE);
    localStorage.removeItem(STORAGE_KEYS.GROUP);
    localStorage.removeItem(STORAGE_KEYS.DURATION);
    localStorage.removeItem(STORAGE_KEYS.WORD_COUNT);
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
    localStorage.removeItem(STORAGE_KEYS.PUNCTUATION);
    localStorage.removeItem(STORAGE_KEYS.NUMBERS);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};
