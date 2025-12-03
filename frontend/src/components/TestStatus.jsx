const TestStatus = ({
  selectedMode,
  selectedDuration,
  selectedWordCount,
  wordsTyped,
  timeElapsed,
  totalQuoteWords,
}) => {
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds}`;
    }

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeDisplay = () => {
    const timeElapsedInSeconds = Math.floor(timeElapsed / 1000);

    if (selectedDuration === 0) {
      return timeElapsedInSeconds;
    }

    const remaining = selectedDuration - timeElapsedInSeconds;
    return Math.max(0, remaining);
  };

  return (
    <div
      className="text-[32px] font-medium m-[0em_0.25em] mt-3"
      style={{ color: "var(--secondary)" }}
    >
      {selectedMode === "zen" ? (
        <div>{wordsTyped}</div>
      ) : selectedMode === "quotes" ? (
        <div>
          {wordsTyped}/{totalQuoteWords}
        </div>
      ) : selectedMode === "words" ? (
        <div>
          {selectedWordCount === 0 ? (
            <>{wordsTyped}</>
          ) : (
            <>
              {wordsTyped}/{selectedWordCount}
            </>
          )}
        </div>
      ) : (
        <div>{formatTime(getTimeDisplay())}</div>
      )}
    </div>
  );
};

export default TestStatus;
