const STORAGE_KEYS = {
  MODE: "lazytype_mode",
  GROUP: "lazytype_group",
  DURATION: "lazytype_duration",
  LANGUAGE: "lazytype_language",
};

const DEFAULTS = {
  MODE: "quotes",
  GROUP: [],
  DURATION: 60,
  LANGUAGE: "english",
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
  saveToStorage(STORAGE_KEYS.LANGUAGE, config.language);
};

export const loadTestConfig = () => {
  return {
    mode: getFromStorage(STORAGE_KEYS.MODE, DEFAULTS.MODE),
    group: getFromStorage(STORAGE_KEYS.GROUP, DEFAULTS.GROUP),
    duration: getFromStorage(STORAGE_KEYS.DURATION, DEFAULTS.DURATION),
    language: getFromStorage(STORAGE_KEYS.LANGUAGE, DEFAULTS.LANGUAGE),
  };
};

export const clearTestConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MODE);
    localStorage.removeItem(STORAGE_KEYS.GROUP);
    localStorage.removeItem(STORAGE_KEYS.DURATION);
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};
