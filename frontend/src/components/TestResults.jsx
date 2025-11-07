import { useState } from "react";
import TooltipHover from "./TooltipHover";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TestResults = ({
  stats,
  timeElapsed,
  selectedMode,
  selectedDuration,
  selectedGroup,
  selectedLanguage,
  actualQuoteGroup,
  quote,
  onNextTest,
  onRepeatTest,
  onTransitionStart,
}) => {
  const [visibleLines, setVisibleLines] = useState({
    wpm: true,
    rawWpm: true,
    burst: true,
    errors: true,
  });

  const handleNextTest = () => {
    if (onTransitionStart) onTransitionStart();
    setTimeout(() => {
      onNextTest();
    }, 150);
  };

  const toggleLine = (lineKey) => {
    setVisibleLines((prev) => ({
      ...prev,
      [lineKey]: !prev[lineKey],
    }));
  };

  const timeElapsedInSeconds = Math.floor(timeElapsed / 1000);

  const formatTime = (milliseconds) => {
    const seconds = Math.round(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTestType = () => {
    if (selectedMode === "quote" || selectedMode === "quotes") {
      const groupNames = ["short", "medium", "long", "very long"];
      let groupName;
      if (
        selectedGroup === null &&
        actualQuoteGroup !== null &&
        actualQuoteGroup !== undefined
      ) {
        groupName = groupNames[actualQuoteGroup];
      } else if (selectedGroup !== null) {
        groupName = groupNames[selectedGroup];
      } else {
        groupName = "all";
      }
      return `quote ${groupName} ${selectedLanguage}`;
    } else if (selectedMode === "time") {
      return `time ${selectedDuration} ${selectedLanguage}`;
    }
    return `${selectedMode} ${selectedLanguage}`;
  };

  const totalErrors = stats.wpmHistory
    ? stats.wpmHistory.reduce((sum, d) => sum + (d.errorCount || 0), 0)
    : 0;

  const maxErrorCount = stats.wpmHistory
    ? Math.max(...stats.wpmHistory.map((d) => d.errorCount || 0), 1)
    : 1;

  const isQuoteMode = selectedMode === "quote" || selectedMode === "quotes";

  const getXAxisKey = () => "time";

  const transformedData = stats.wpmHistory
    ? stats.wpmHistory.map((item, index) => {
      const second = Math.floor(item.time) || index + 1;
      return {
        ...item,
        second,
        time: item.time,
      };
    })
    : [];

  if (isQuoteMode && transformedData.length > 0) {
    const lastPoint = transformedData[transformedData.length - 1];
    const exactFinalSeconds = parseFloat((timeElapsed / 1000).toFixed(2));
    if (Math.abs(lastPoint.time - exactFinalSeconds) > 0.01) {
      transformedData.push({
        time: exactFinalSeconds,
        wpm: stats.wpm,
        rawWpm: stats.rawWpm,
        burst: lastPoint.burst || 0,
        words: lastPoint.words,
        errorCount: lastPoint.errorCount,
      });
    }
  }

  const generateXAxisTicks = () => {
    if (!isQuoteMode) {
      const duration = timeElapsedInSeconds;
      if (duration <= 30) {
        return Array.from({ length: duration }, (_, i) => i + 1);
      }
      if (duration <= 60) {
        const ticks = [];
        for (let i = 1; i <= duration; i += 3) {
          ticks.push(i);
        }
        if (!ticks.includes(duration)) {
          ticks.push(duration);
        }
        return ticks;
      }
      if (duration <= 120) {
        const ticks = [];
        for (let i = 1; i <= duration; i += 5) {
          ticks.push(i);
        }
        if (!ticks.includes(duration)) {
          ticks.push(duration);
        }
        return ticks;
      }
      const interval = duration <= 240 ? 10 : 15;
      const ticks = [];
      for (let i = interval; i <= duration; i += interval) {
        ticks.push(i);
      }
      if (!ticks.includes(duration)) {
        ticks.push(duration);
      }
      return ticks;
    }
    const ticks = [];
    const exactFinalSeconds = parseFloat((timeElapsed / 1000).toFixed(2));
    for (let i = 1; i <= Math.floor(exactFinalSeconds); i++) ticks.push(i);
    if (!ticks.includes(exactFinalSeconds)) ticks.push(exactFinalSeconds);
    return ticks;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload && payload.errorCount > 0) {
      return (
        <g>
          <line
            x1={cx - 4}
            y1={cy - 4}
            x2={cx + 4}
            y2={cy + 4}
            stroke="#fb4934"
            strokeWidth={2}
          />
          <line
            x1={cx - 4}
            y1={cy + 4}
            x2={cx + 4}
            y2={cy - 4}
            stroke="#fb4934"
            strokeWidth={2}
          />
        </g>
      );
    }
    return null;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="backdrop-blur-md border border-[#3c3836]/80 bg-[#1d2021]/90 rounded-xl shadow-lg p-3 text-xs text-[#ebdbb2] space-y-1.5"
          style={{
            minWidth: "150px",
            boxShadow: "0 0 8px rgba(0,0,0,0.4), 0 0 8px rgba(184,187,38,0.1)",
          }}
        >
          <div className="flex justify-between text-gray-400 text-[11px] border-b border-[#3c3836]/60 pb-1 mb-1">
            <span>{typeof data.time === "number" ? "Time" : "Second"}</span>
            <span>
              {typeof data.time === "number"
                ? `${data.time.toFixed(2)}s`
                : `${data.time}`}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {visibleLines.errors && (
              <div className="flex justify-between">
                <span className="text-[#fb4934]">Errors</span>
                <span className="text-[#fb4934]">{data.errorCount}</span>
              </div>
            )}
            {visibleLines.wpm && (
              <div className="flex justify-between">
                <span className="text-[#b8bb26] font-semibold">WPM</span>
                <span className="text-[#b8bb26] font-semibold">{data.wpm}</span>
              </div>
            )}
            {visibleLines.rawWpm && (
              <div className="flex justify-between">
                <span className="text-[#FF9D00]">Raw WPM</span>
                <span className="text-[#FF9D00]">{data.rawWpm}</span>
              </div>
            )}
            {visibleLines.burst && (
              <div className="flex justify-between">
                <span className="text-[#625750]">Burst</span>
                <span className="text-[#625750]">{data.burst}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="test-result-container flex flex-col items-center justify-center py-4 w-full mx-auto">
      {stats.wpmHistory && stats.wpmHistory.length > 1 && (
        <div className="w-full mb-4">
          <div className="flex gap-0">
            {/* left stats */}
            <div className="flex flex-col justify-center gap-8">
              <div className="text-left">
                <div className="text-sm text-gray-500 mb-1">WPM</div>
                <TooltipHover text={`${stats.wpmExact?.toFixed(2)} wpm`}>
                  <div className="text-5xl font-bold text-[#b8bb26]">
                    {stats.wpm}
                  </div>
                </TooltipHover>
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-500 mb-1">Accuracy</div>
                <TooltipHover
                  text={
                    <>
                      <div>{stats.accuracyExact?.toFixed(2)}%</div>
                      <div className="text-[#b8bb26]">
                        {stats.totalCorrected} correct
                      </div>
                      <div className="text-[#fb4934]">
                        {stats.totalMistakes} incorrect
                      </div>
                    </>
                  }
                >
                  <div className="text-5xl font-bold text-[#83a598]">
                    {stats.accuracy}%
                  </div>
                </TooltipHover>
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-500 mb-1">Test Type</div>
                <div className="text-lg font-medium text-gray-400">
                  {formatTestType()}
                </div>
              </div>
            </div>
            {/* graph */}
            <div className="flex-1 bg-[#282828] p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={transformedData}
                  margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                  tabIndex={-1}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#3c3836" />
                  <XAxis
                    dataKey={getXAxisKey()}
                    stroke="#928374"
                    tick={{ fontSize: 12 }}
                    type="number"
                    domain={[
                      1,
                      isQuoteMode
                        ? parseFloat((timeElapsed / 1000).toFixed(2))
                        : timeElapsedInSeconds,
                    ]}
                    ticks={generateXAxisTicks()}
                    tickFormatter={(v) =>
                      v % 1 === 0 ? `${v}` : `${v.toFixed(2)}`
                    }
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#928374"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "WPM",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#928374",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#928374"
                    tick={totalErrors > 0 ? { fontSize: 12 } : false}
                    domain={[0, maxErrorCount]}
                    label={{
                      value: "Errors",
                      angle: 90,
                      position: "insideRight",
                      fill: "#928374",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {visibleLines.burst && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="burst"
                      stroke="#625750"
                      strokeWidth={3}
                      name="Burst"
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                  {visibleLines.rawWpm && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="rawWpm"
                      stroke="#FF9D00"
                      strokeWidth={2}
                      strokeDasharray="8 8"
                      name="Raw WPM"
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                  {visibleLines.wpm && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="wpm"
                      stroke="#b8bb26"
                      strokeWidth={2}
                      name="WPM"
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                  {visibleLines.errors && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="errorCount"
                      stroke="transparent"
                      dot={<CustomDot />}
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
                <button
                  onClick={() => toggleLine("wpm")}
                  tabIndex={-1}
                  className={`flex items-center gap-2 transition-all hover:text-gray-300 ${!visibleLines.wpm ? "opacity-40 line-through" : ""
                    }`}
                >
                  <div className="w-5 h-0.5 bg-[#b8bb26]" />
                  <span>WPM</span>
                </button>
                <button
                  onClick={() => toggleLine("rawWpm")}
                  tabIndex={-1}
                  className={`flex items-center gap-2 transition-all hover:text-gray-300 ${!visibleLines.rawWpm ? "opacity-40 line-through" : ""
                    }`}
                >
                  <div className="w-5 h-[2px] bg-[linear-gradient(90deg,#fabd2f_0%,#fabd2f_40%,transparent_40%,transparent_60%,#fabd2f_60%,#fabd2f_100%)]" />
                  <span>Raw WPM</span>
                </button>
                <button
                  onClick={() => toggleLine("burst")}
                  tabIndex={-1}
                  className={`flex items-center gap-2 transition-all hover:text-gray-300 ${!visibleLines.burst ? "opacity-40 line-through" : ""
                    }`}
                >
                  <div className="w-5 h-0.5 bg-[#625750]" />
                  <span>Burst</span>
                </button>
                <button
                  onClick={() => toggleLine("errors")}
                  tabIndex={-1}
                  className={`flex items-center gap-2 transition-all hover:text-gray-300 ${!visibleLines.errors ? "opacity-40 line-through" : ""
                    }`}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16">
                    <line
                      x1="3"
                      y1="3"
                      x2="13"
                      y2="13"
                      stroke="#fb4934"
                      strokeWidth="2"
                    />
                    <line
                      x1="3"
                      y1="13"
                      x2="13"
                      y2="3"
                      stroke="#fb4934"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Errors</span>
                </button>
              </div>
              {isQuoteMode && quote?.source && (
                <div className="mt-3 pt-3 border-t border-[#3c3836] text-center">
                  <span className="text-sm text-gray-500 italic">
                    {quote.source}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* bottom stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8 lg:gap-12 mt-10">
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Raw WPM</div>
              <TooltipHover text={`${stats.rawWpmExact?.toFixed(2)} wpm`}>
                <div className="text-2xl sm:text-3xl font-bold text-[#fabd2f]">
                  {stats.rawWpm}
                </div>
              </TooltipHover>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Time</div>
              <TooltipHover
                text={
                  isQuoteMode
                    ? `${(timeElapsed / 1000).toFixed(2)}s`
                    : `${timeElapsedInSeconds}s`
                }
              >
                <div className="text-2xl sm:text-3xl font-bold text-[#d3869b]">
                  {formatTime(timeElapsed)}
                </div>
              </TooltipHover>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Correct Words</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#d3869b]">
                {stats.correctWords}
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Correct Chars</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#d3869b]">
                {stats.correctChars}
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Incorrect Chars</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#d3869b]">
                {stats.incorrectChars}
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Extra Chars</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#d3869b]">
                {stats.extraChars}
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Missed Chars</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#d3869b]">
                {stats.missedChars}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-2">
        <button
          onClick={handleNextTest}
          className="flex items-center gap-2 px-8 py-3 bg-[#282828] hover:bg-[#3c3836] text-[#b8bb26] rounded-lg transition-all border border-[#3c3836] hover:border-[#b8bb26] font-medium"
          aria-label="Next Test"
        >
          <span className="text-base">Next Test</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 3L11 8L6 13V3Z" />
          </svg>
        </button>
        <button
          onClick={onRepeatTest}
          className="flex items-center gap-2 px-8 py-3 bg-[#282828] hover:bg-[#3c3836] text-[#fabd2f] rounded-lg transition-all border border-[#3c3836] hover:border-[#fabd2f] font-medium"
          aria-label="Repeat Test"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C10.3 2 12.3 3.2 13.4 5M13 2V5H10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-base">Repeat Test</span>
        </button>
      </div>
    </div>
  );
};

export default TestResults;
