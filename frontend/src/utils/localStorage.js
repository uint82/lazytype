const STORAGE_KEYS = {
  MODE: "lazytype_mode",
  GROUP: "lazytype_group",
  DURATION: "lazytype_duration",
  WORD_COUNT: "lazytype_word_count",
  LANGUAGE: "lazytype_language",
  PUNCTUATION: "lazytype_punctuation",
  NUMBERS: "lazytype_numbers",
  SELECTED_QUOTE_ID: "lazytype_selected_quote_id",
};

const DEFAULTS = {
  MODE: "quotes",
  GROUP: null,
  DURATION: 60,
  WORD_COUNT: 25,
  LANGUAGE: "english",
  PUNCTUATION: false,
  NUMBERS: false,
  SELECTED_QUOTE_ID: null,
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

  if (config.selectedQuoteId) {
    saveToStorage(STORAGE_KEYS.SELECTED_QUOTE_ID, config.selectedQuoteId);
  } else {
    clearSelectedQuote();
  }
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
    selectedQuoteId: getFromStorage(
      STORAGE_KEYS.SELECTED_QUOTE_ID,
      DEFAULTS.SELECTED_QUOTE_ID,
    ),
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
    localStorage.removeItem(STORAGE_KEYS.SELECTED_QUOTE_ID);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

export const clearSelectedQuote = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_QUOTE_ID);
  } catch (error) {
    console.error("Error clearing selected quote:", error);
  }
};
