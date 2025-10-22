import { useState, useEffect, useRef } from "react";
import { getRandomQuote } from "../controllers/quotes-controller";
import WordGenerator from "../components/WordGenerator";
import TestConfig from "../components/TestConfig";

const Lazytype = () => {
  const [quote, setQuote] = useState(null);
  const [input, setInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMode, setSelectedMode] = useState("quotes");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedMode !== "quotes") return;

    const q = getRandomQuote(selectedGroup);
    setQuote(q);
    setInput("");

    if (inputRef.current) inputRef.current.focus();
  }, [selectedGroup, selectedMode]);

  useEffect(() => {
    if (selectedMode !== "words") return;

    setInput("");

    if (inputRef.current) inputRef.current.focus();
  }, [selectedMode, selectedDuration]);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleNewQuote = () => {
    if (selectedMode === "quotes") {
      const q = getRandomQuote(selectedGroup);
      setQuote(q);
    }

    setInput("");
    inputRef.current.focus();
  };

  return (
    <div className="flex flex-col items-center text-center mx-auto w-full">
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <TestConfig
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />

      <div
        style={{
          "--content-max-width": "1736px",
          "--breakout-size":
            "calc((calc(var(--content-max-width) + 12rem) - var(--content-max-width)) / 2)",
        }}
        className="relative mx-auto text-gray-600 w-full max-w-[1736px] px-[var(--breakout-size)]"
        onClick={() => inputRef.current.focus()}
      >
        {quote ? (
          <>
            <WordGenerator text={quote.text} input={input} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              className="opacity-0 absolute"
              autoFocus
            />
          </>
        ) : (
          <p className="text-[#ebdbb2]">Loading test...</p>
        )}
      </div>

      <button
        onClick={handleNewQuote}
        className="mt-8 px-4 py-2 rounded text-4xl text-gray-600 cursor-pointer hover:text-white transition"
      >
        ⟳
      </button>
    </div>
  );
};

export default Lazytype;
