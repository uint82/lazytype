import { useState } from "react";
import TooltipHover from "./TooltipHover";
import { ChevronRight, RefreshCcw } from "lucide-react";
import {
  ComposedChart,
  Line,
  Area,
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
  selectedWordCount,
  selectedGroup,
  selectedLanguage,
  selectedPunctuation,
  selectedNumbers,
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

    if (seconds < 60) {
      return `${seconds}s`;
    }

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
      return `quote ${groupName}\n${selectedLanguage}`;
    } else if (selectedMode === "time") {
      let extras = [];
      if (selectedPunctuation) extras.push("punctuation");
      if (selectedNumbers) extras.push("numbers");
      return `time ${selectedDuration}\n${selectedLanguage}${extras.length ? "\n" + extras.join("\n") : ""
        }`;
    } else if (selectedMode === "words") {
      let extras = [];
      if (selectedPunctuation) extras.push("punctuation");
      if (selectedNumbers) extras.push("numbers");
      return `words ${selectedWordCount}\n${selectedLanguage}${extras.length ? "\n" + extras.join("\n") : ""
        }`;
    }
    return `${selectedMode}\n${selectedLanguage}`;
  };

  const totalErrors = stats.wpmHistory
    ? stats.wpmHistory.reduce((sum, d) => sum + (d.errorCount || 0), 0)
    : 0;

  const maxErrorCount = stats.wpmHistory
    ? Math.max(...stats.wpmHistory.map((d) => d.errorCount || 0), 1)
    : 1;

  const isQuoteMode = selectedMode === "quote" || selectedMode === "quotes";
  const isWordsMode = selectedMode === "words" || selectedMode === "words";

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

  if (isQuoteMode && isWordsMode && transformedData.length > 0) {
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

  const Cursor = (props) => {
    const { points } = props;
    if (!points || points.length === 0) return null;

    return (
      <g>
        {points.map((index) => (
          <circle key={index} r={4} opacity={0.8} />
        ))}
      </g>
    );
  };

  const generateXAxisTicks = () => {
    if (!isQuoteMode && !isWordsMode) {
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
    const lastFullSecond = Math.floor(exactFinalSeconds);
    const remainder = exactFinalSeconds - lastFullSecond;

    for (let i = 1; i <= lastFullSecond; i++) ticks.push(i);

    if (remainder >= 0.5 && !ticks.includes(exactFinalSeconds)) {
      ticks.push(exactFinalSeconds);
    }

    return ticks;
  };

  const CustomDot = (props) => {
    const { cx, cy, stroke } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={1.5}
        fill={stroke}
        stroke={stroke}
        strokeWidth={2}
      />
    );
  };

  const CustomErrorDot = (props) => {
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
                <span className="text-[#b8bb26] ">WPM</span>
                <span className="text-[#b8bb26] ">{data.wpm}</span>
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
    <div className="flex flex-col items-center justify-center py-4 w-full mx-auto">
      {stats.wpmHistory && stats.wpmHistory.length > 1 && (
        <div className="w-full">
          <div className="flex flex-col md:flex-row lg:gap-0 w-full">
            {/* left stats */}
            <div className="flex flex-row justify-center w-full md:w-auto md:gap-0 gap-12 sm:w-auto lg:mb-0 md:flex-col">
              <div className="md:text-left text-center">
                <div className="text-[2rem] text-gray-500">wpm</div>
                <TooltipHover text={`${stats.wpmExact?.toFixed(2)} wpm`}>
                  <div className="text-[4rem] -mt-6 -mb-6 text-[#b8bb26]">
                    {stats.wpm}
                  </div>
                </TooltipHover>
              </div>
              <div className="md:text-left text-center">
                <div className="text-[2rem] text-gray-500">acc</div>
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
                  <div className="text-[4rem] -mt-6 text-[#83a598]">
                    {stats.accuracy}%
                  </div>
                </TooltipHover>
              </div>
            </div>
            {/* graph */}
            <div className="flex-1 bg-[#282828] rounded-lg mt-4 relative group breakout">
              {/* legend */}
              <div className="absolute bottom-1 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#282828]/95 backdrop-blur-sm rounded-lg pointer-events-none">
                <div className="flex flex-row gap-3 text-[11px]">
                  <button
                    onClick={() => toggleLine("wpm")}
                    tabIndex={-1}
                    className={`flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md ${!visibleLines.wpm
                        ? "hoever:bg-[#0C0C0C]/40 line-through hover:text-white"
                        : "hover:bg-[#0C0C0C]/40 hover:text-white"
                      }`}
                  >
                    <div
                      className={`w-5 h-0.5 transition-colors ${!visibleLines.wpm ? "bg-gray-500" : "bg-[#b8bb26]"
                        }`}
                    />
                    <span className="text-[12px]">wpm</span>
                  </button>
                  <button
                    onClick={() => toggleLine("rawWpm")}
                    tabIndex={-1}
                    className={`flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md ${!visibleLines.rawWpm
                        ? "hover:bg-[#0C0C0C]/40 line-through hover:text-white"
                        : "hover:bg-[#0C0C0C]/40 hover:text-white"
                      }`}
                  >
                    <div
                      className={`w-5 h-[2px] transition-all ${!visibleLines.rawWpm
                          ? "bg-[linear-gradient(90deg,#6b7280_0%,#6b7280_40%,transparent_40%,transparent_60%,#6b7280_60%,#6b7280_100%)]"
                          : "bg-[linear-gradient(90deg,#fabd2f_0%,#fabd2f_40%,transparent_40%,transparent_60%,#fabd2f_60%,#fabd2f_100%)]"
                        }`}
                    />
                    <span>raw</span>
                  </button>
                  <button
                    onClick={() => toggleLine("burst")}
                    tabIndex={-1}
                    className={`flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md ${!visibleLines.burst
                        ? "hover:bg-[#0C0C0C0]/40 line-through hover:text-white"
                        : "hover:bg-[#0C0C0C]/40 hover:text-white"
                      }`}
                  >
                    <div className="w-5 h-[3px] bg-[#625750]" />
                    <span>burst</span>
                  </button>
                  <button
                    onClick={() => toggleLine("errors")}
                    tabIndex={-1}
                    className={`flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md ${!visibleLines.errors
                        ? "hover:bg-[#0C0C0C]/40 line-through hover:text-white"
                        : "hover:bg-[#0C0C0C]/40 hover:text-white"
                      }`}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16">
                      <line
                        x1="3"
                        y1="3"
                        x2="13"
                        y2="13"
                        stroke={!visibleLines.errors ? "#6b7280" : "#fb4934"}
                        strokeWidth="2"
                      />
                      <line
                        x1="3"
                        y1="13"
                        x2="13"
                        y2="3"
                        stroke={!visibleLines.errors ? "#6b7280" : "#fb4934"}
                        strokeWidth="2"
                      />
                    </svg>
                    <span>Errors</span>
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart
                  data={transformedData}
                  margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                  tabIndex={-1}
                >
                  <defs>
                    <linearGradient
                      id="burstGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="100%"
                        stopColor="#0C0C0C"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="#0C0C0C"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="black" strokeOpacity={0.2} />
                  <XAxis
                    dataKey={getXAxisKey()}
                    stroke="black"
                    strokeWidth={1}
                    strokeOpacity={0.1}
                    tick={{ fontSize: 12, fill: "#928374" }}
                    type="number"
                    domain={[
                      1,
                      (() => {
                        if (!isQuoteMode && !isWordsMode) {
                          return timeElapsedInSeconds;
                        }
                        const exactFinalSeconds = parseFloat(
                          (timeElapsed / 1000).toFixed(2),
                        );
                        const lastFullSecond = Math.floor(exactFinalSeconds);
                        const remainder = exactFinalSeconds - lastFullSecond;
                        return remainder >= 0.5
                          ? exactFinalSeconds
                          : lastFullSecond;
                      })(),
                    ]}
                    ticks={generateXAxisTicks()}
                    tickFormatter={(v) =>
                      v % 1 === 0 ? `${v}` : `${v.toFixed(2)}`
                    }
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="black"
                    strokeWidth={1}
                    strokeOpacity={0.1}
                    tick={{ fontSize: 12, fill: "#928374" }}
                    label={{
                      value: "Words per Minute",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#928374",
                      fontSize: 12,
                      style: { textAnchor: "middle" },
                      offset: 15,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="black"
                    strokeWidth={1}
                    strokeOpacity={0.1}
                    tick={
                      totalErrors > 0
                        ? { fontSize: 12, fill: "#928374" }
                        : false
                    }
                    domain={[0, maxErrorCount]}
                    label={{
                      value: "Errors",
                      angle: 90,
                      position: "insideRight",
                      fill: "#928374",
                      fontSize: 12,
                      style: { textAnchor: "middle" },
                      offset: 15,
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={<Cursor />} />
                  {visibleLines.burst && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="burst"
                      fill="url(#burstGradient)"
                      stroke="#625750"
                      isAnimationActive={false}
                      activeDot={false}
                    />
                  )}
                  {visibleLines.burst && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="burst"
                      stroke="#625750"
                      strokeWidth={3}
                      name="Burst"
                      dot={<CustomDot />}
                      isAnimationActive={false}
                      activeDot={false}
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
                      activeDot={false}
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
                      dot={<CustomDot />}
                      isAnimationActive={false}
                      activeDot={false}
                    />
                  )}
                  {visibleLines.errors && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="errorCount"
                      stroke="transparent"
                      dot={<CustomErrorDot />}
                      isAnimationActive={false}
                      activeDot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* bottom stats */}
          <style>{`
            .bottom-stats-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(140px, 1fr));
              column-gap: 2rem;
              gap: 1rem;
            }
            @media only screen and (min-width: 768px) {
              .bottom-stats-grid {
                display: grid;
                gap: 0rem;
                grid-template-columns: repeat(3, minmax(140px, 1fr));
                grid-auto-flow: row;
              }
            }
            @media only screen and (min-width: 1024px) {
              .bottom-stats-grid {
                grid-auto-flow: column;
                grid-template-columns: none;
                grid-template-areas: none;
                align-items: flex-start;
                column-gap: 2rem;
                justify-content: space-between;
                grid-row-start: bottom-stats-grid;
                grid-row-end: bottom-stats-grid;
                grid-column-start: bottom-stats-grid;
                grid-column-end: bottom-stats-grid;
              }
            }
          `}</style>
          <div className="bottom-stats-grid">
            <div className="md:text-left text-center">
              <div className="text-sm text-gray-500">test type</div>
              <div
                className="text-md text-gray-400"
                style={{ whiteSpace: "pre-line" }}
              >
                {formatTestType()}
              </div>
            </div>
            <div className="md:text-left text-center">
              <div className="text-sm text-gray-500">raw</div>
              <TooltipHover text={`${stats.rawWpmExact?.toFixed(2)} wpm`}>
                <div className="text-2xl sm:text-3xl text-[#d3869b]">
                  {stats.rawWpm}
                </div>
              </TooltipHover>
            </div>
            <div className="md:text-left text-center">
              <div className="text-sm text-gray-500">characters</div>
              <TooltipHover
                text={
                  <>
                    <div className="text-[#b8bb26]">
                      {stats.correctChars} correct
                    </div>
                    <div className="text-[#fb4934]">
                      {stats.incorrectChars} incorrect
                    </div>
                    <div className="text-[#fabd2f]">
                      {stats.extraChars} extra
                    </div>
                    <div className="text-[#83a598]">
                      {stats.missedChars} missed
                    </div>
                  </>
                }
              >
                <div className="text-2xl sm:text-3xl text-[#d3869b] font-mono">
                  {stats.correctChars}/{stats.incorrectChars}/{stats.extraChars}
                  /{stats.missedChars}
                </div>
              </TooltipHover>
            </div>
            <div className="md:text-left text-center">
              <div className="text-sm text-gray-500">correct words</div>
              <div className="text-2xl sm:text-3xl text-[#d3869b]">
                {stats.correctWords}
              </div>
            </div>
            <div className="md:text-left text-center">
              <div className="text-sm text-gray-500">time</div>
              <TooltipHover text={`${(timeElapsed / 1000).toFixed(2)}s`}>
                <div className="text-2xl sm:text-3xl text-[#d3869b]">
                  {formatTime(timeElapsed)}
                </div>
              </TooltipHover>
            </div>
            {isQuoteMode && quote?.source && (
              <div className="md:text-left text-center">
                <div className="text-sm text-gray-500">source</div>
                <div className="text-md font-medium text-[#b8bb26] italic">
                  {quote.source}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={handleNextTest}
          className="flex items-center gap-2 px-6 py-3 bg-[#282828] rounded-lg hover:text-white cursor-pointer font-bold"
          aria-label="Next Test"
        >
          <ChevronRight />
        </button>
        <button
          onClick={onRepeatTest}
          className="flex items-center gap-2 px-6 py-3 bg-[#282828] rounded-lg hover:text-white cursor-pointer font-bold"
          aria-label="Repeat Test"
        >
          🗘
        </button>
      </div>
    </div>
  );
};

export default TestResults;
