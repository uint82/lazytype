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
    const timeElapsedInSeconds = Math.floor(timeElapsed / 1000);
    const remaining = selectedDuration - timeElapsedInSeconds;
    return Math.max(0, remaining);
  };
  return (
    <div className="text-[#C68C22] text-[32px] font-medium m-[0em_0.25em] mt-3">
      {selectedMode === "quotes" || selectedMode === "words" ? (
        <div>
          {wordsTyped}/{totalWords}
        </div>
      ) : (
        <div>{formatTime(getTimeRemaining())}</div>
      )}
    </div>
  );
};
export default TestStatus;
