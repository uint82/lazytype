export function tokenizeText(text) {
  text = text.replace(/…/g, "...");

  const words = text.split(" ");

  const processedWords = [];

  words.forEach((word) => {
    if (/^\.+$/.test(word)) {
      for (let i = 0; i < word.length; i++) {
        processedWords.push(".");
      }
    } else if (word) {
      processedWords.push(word);
    }
  });

  return processedWords;
}

export function normalizeForComparison(text) {
  return text.replace(/—/g, "-").replace(/…/g, "...");
}
