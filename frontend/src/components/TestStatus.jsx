const TestStatus = ({
  selectedMode,
  selectedDuration,
  totalWords,
  wordsTyped,
  timeElapsed,
}) => {
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds}`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeRemaining = () => {
    const remaining = selectedDuration - timeElapsed;
    return Math.max(0, remaining);
  };

  return (
    <div className="text-[#C68C22] text-2xl font-medium mt-10">
      {selectedMode === "quotes" ? (
        <div>
          {wordsTyped} / {totalWords}
        </div>
      ) : (
        <div>{formatTime(getTimeRemaining())}</div>
      )}
    </div>
  );
};

export default TestStatus;
