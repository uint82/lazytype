import { useState, useEffect, useRef, useMemo } from "react";
import TooltipHover from "./TooltipHover";
import InputHistory from "./InputHistory";
import { useWordHistory } from "../hooks/useWordHistory";
import { ChevronRight, RefreshCw, History } from "lucide-react";
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
  input,
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
  addNotification,
  displayWords,
  typedHistory = {},
}) => {
  const [visibleLines, setVisibleLines] = useState({
    wpm: true,
    rawWpm: true,
    burst: true,
    errors: true,
  });

  const [showWordHistory, setShowWordHistory] = useState(false);
  const [hoveredSecond, setHoveredSecond] = useState(null);
  const hasShownMessageRef = useRef(false);

  const wordHistory = useWordHistory(
    displayWords,
    input,
    typedHistory,
    selectedMode,
  );

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

  const formatTime = (milliseconds) => {
    const seconds = Math.round(milliseconds / 1000);
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTestType = () => {
    if (selectedMode === "quote" || selectedMode === "quotes") {
      const groupNames = ["short", "medium", "long", "very long"];
      let groupName;
      if (selectedGroup === null && actualQuoteGroup !== null) {
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

  const transformedData = useMemo(() => {
    if (!stats.wpmHistory) return [];

    const data = stats.wpmHistory.map((item, index) => {
      const second = Math.floor(item.time) || index + 1;
      return {
        ...item,
        second,
        time: item.time,
      };
    });

    if (isQuoteMode && isWordsMode && data.length > 0) {
      const lastPoint = data[data.length - 1];
      const exactFinalSeconds = parseFloat((timeElapsed / 1000).toFixed(2));
      if (Math.abs(lastPoint.time - exactFinalSeconds) > 0.01) {
        data.push({
          time: exactFinalSeconds,
          wpm: stats.wpm,
          rawWpm: stats.rawWpm,
          burst: lastPoint.burst || 0,
          words: lastPoint.words,
          errorCount: lastPoint.errorCount,
        });
      }
    }
    return data;
  }, [
    stats.wpmHistory,
    stats.wpm,
    stats.rawWpm,
    isQuoteMode,
    isWordsMode,
    timeElapsed,
  ]);

  const generateXAxisTicks = () => {
    const exactFinalSeconds = parseFloat((timeElapsed / 1000).toFixed(2));
    const lastFullSecond = Math.floor(exactFinalSeconds);
    const remainder = exactFinalSeconds - lastFullSecond;

    if (!isQuoteMode && !isWordsMode) {
      const duration = lastFullSecond;
      const ticks = [];
      if (duration <= 30) {
        for (let i = 1; i <= duration; i++) ticks.push(i);
      } else if (duration <= 60) {
        for (let i = 1; i <= duration; i += 3) ticks.push(i);
        if (!ticks.includes(duration)) ticks.push(duration);
      } else if (duration <= 120) {
        for (let i = 1; i <= duration; i += 5) ticks.push(i);
        if (!ticks.includes(duration)) ticks.push(duration);
      } else {
        const interval = duration <= 240 ? 10 : 15;
        for (let i = interval; i <= duration; i += interval) ticks.push(i);
        if (!ticks.includes(duration)) ticks.push(duration);
      }
      if (remainder >= 0.5 && !ticks.includes(exactFinalSeconds)) {
        ticks.push(exactFinalSeconds);
      }
      return ticks;
    }

    const ticks = [];
    const remainder2 = exactFinalSeconds - lastFullSecond;
    for (let i = 1; i <= lastFullSecond; i++) ticks.push(i);
    if (remainder2 >= 0.5 && !ticks.includes(exactFinalSeconds)) {
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

  useEffect(() => {
    if (
      stats.wpm === 0 &&
      stats.correctChars === 0 &&
      addNotification &&
      !hasShownMessageRef.current
    ) {
      const testWordCount = displayWords
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length;

      if (testWordCount >= 10) {
        const funnyMessages = [
          `Congrats, you just wasted ${formatTime(
            timeElapsed,
          )} of your life. You absolute legend.`,
          `Achievement Unlocked: 0 WPM! That's impressively bad.`,
          `${formatTime(
            timeElapsed,
          )} well spent doing absolutely nothing. Bravo!`,
          `You managed to type 0 words in ${formatTime(
            timeElapsed,
          )}. That's... something.`,
        ];

        const randomMessage =
          funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        addNotification(randomMessage, "notice", 6000);
        hasShownMessageRef.current = true;
      }
    }
  }, [
    stats.wpm,
    stats.correctChars,
    addNotification,
    displayWords,
    timeElapsed,
  ]);

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
      <div className="w-full">
        <div className="flex flex-col md:flex-row lg:gap-0 w-full">
          {/* left stats */}
          <div className="flex flex-row justify-center w-full md:w-auto md:gap-0 gap-12 sm:w-auto lg:mb-0 md:flex-col">
            <div className="md:text-left text-center">
              <div className="text-[2rem] text-gray-500">wpm</div>
              <TooltipHover text={`${stats.wpmExact?.toFixed(2)} wpm`}>
                <div className="text-[4rem] -mt-6 -mb-6 text-[#b8bb26]">
                  {stats.wpm >= 1000 ? "Infinite" : stats.wpm}
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
                      ? "hover:bg-[#0C0C0C]/40 line-through text-white"
                      : "hover:bg-[#0C0C0C]/40 hover:text-white"
                    }`}
                >
                  <div
                    className={`w-5 h-0.5 transition-colors ${!visibleLines.wpm ? "bg-gray-500" : "bg-[#b8bb26]"
                      }`}
                  />
                  <span className="text-[12px] text-[#a89984]">wpm</span>
                </button>
                <button
                  onClick={() => toggleLine("rawWpm")}
                  tabIndex={-1}
                  className={`flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md ${!visibleLines.rawWpm
                      ? "hover:bg-[#0C0C0C]/40 line-through text-white"
                      : "hover:bg-[#0C0C0C]/40 hover:text-white"
                    }`}
                >
                  <div
                    className={`w-5 h-[2px] transition-all ${!visibleLines.rawWpm
                        ? "bg-[linear-gradient(90deg,#6b7280_0%,#6b7280_40%,transparent_40%,transparent_60%,#6b7280_60%,#6b7280_100%)]"
                        : "bg-[linear-gradient(90deg,#fabd2f_0%,#fabd2f_40%,transparent_40%,transparent_60%,#fabd2f_60%,#fabd2f_100%)]"
                      }`}
                  />
                  <span className="text-[12px] text-[#a89984]">raw</span>
                </button>
                <button
                  onClick={() => toggleLine("burst")}
                  tabIndex={-1}
                  className={`flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md ${!visibleLines.burst
                      ? "hover:bg-[#0C0C0C]/40 line-through text-white"
                      : "hover:bg-[#0C0C0C]/40 hover:text-white"
                    }`}
                >
                  <div className="w-5 h-[3px] bg-[#625750]" />
                  <span className="text-[12px] text-[#a89984]">burst</span>
                </button>
                <button
                  onClick={() => toggleLine("errors")}
                  tabIndex={-1}
                  className={`flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md ${!visibleLines.errors
                      ? "hover:bg-[#0C0C0C]/40 line-through text-white"
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
                  <span className="text-[12px] text-[#a89984]">Errors</span>
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart
                data={transformedData}
                margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                tabIndex={-1}
                onMouseMove={(state) => {
                  if (
                    state?.isTooltipActive &&
                    state?.activeTooltipIndex !== undefined
                  ) {
                    const dataPoint = transformedData[state.activeTooltipIndex];
                    if (dataPoint) {
                      setHoveredSecond(dataPoint.time);
                    }
                  }
                }}
                onMouseLeave={() => setHoveredSecond(null)}
              >
                <defs>
                  <linearGradient
                    id="burstGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="100%" stopColor="#0C0C0C" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0C0C0C" stopOpacity={0.2} />
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
                    totalErrors > 0 ? { fontSize: 12, fill: "#928374" } : false
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
                <Tooltip content={<CustomTooltip />} cursor={false} />
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

        <div className="bottom-stats-grid">
          <div className="text-left">
            <div className="text-md text-gray-500">test type</div>
            <div
              className="text-md text-gray-400"
              style={{ whiteSpace: "pre-line" }}
            >
              {formatTestType()}
            </div>
          </div>
          <div className="text-left">
            <div className="text-md text-gray-500">raw</div>
            <TooltipHover text={`${stats.rawWpmExact?.toFixed(2)} wpm`}>
              <div className="text-2xl sm:text-3xl text-[#d3869b]">
                {stats.rawWpm}
              </div>
            </TooltipHover>
          </div>
          <div className="text-left">
            <div className="text-md text-gray-500">characters</div>
            <TooltipHover
              text={
                <>
                  <div className="text-[#b8bb26]">
                    {stats.correctChars} correct
                  </div>
                  <div className="text-[#fb4934]">
                    {stats.incorrectChars} incorrect
                  </div>
                  <div className="text-[#fabd2f]">{stats.extraChars} extra</div>
                  <div className="text-[#83a598]">
                    {stats.missedChars} missed
                  </div>
                </>
              }
            >
              <div className="text-2xl sm:text-3xl text-[#d3869b] font-mono">
                {stats.correctChars}/{stats.incorrectChars}/{stats.extraChars}/
                {stats.missedChars}
              </div>
            </TooltipHover>
          </div>
          <div className="text-left">
            <div className="text-md text-gray-500">consistency</div>
            <TooltipHover text={`${stats.consistencyExact.toFixed(2)}%`}>
              <div className="text-2xl sm:text-3xl text-[#d3869b]">
                {stats.consistency}%
              </div>
            </TooltipHover>
          </div>
          <div className="text-left">
            <div className="text-md text-gray-500">time</div>
            <TooltipHover text={`${(timeElapsed / 1000).toFixed(2)}s`}>
              <div className="text-2xl sm:text-3xl text-[#d3869b]">
                {formatTime(timeElapsed)}
              </div>
            </TooltipHover>
          </div>
          {isQuoteMode && quote?.source && (
            <div className="text-left">
              <div className="text-md text-gray-500">source</div>
              <div className="text-md font-medium text-[#b8bb26] italic">
                {quote.source}
              </div>
            </div>
          )}
        </div>
      </div>

      <InputHistory
        wordHistory={wordHistory}
        displayWords={displayWords}
        addNotification={addNotification}
        hoveredSecond={hoveredSecond}
        wordIndicesBySecond={stats.wordIndicesBySecond}
        isVisible={showWordHistory}
      />

      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={handleNextTest}
          className="flex items-center gap-2 px-6 py-3 text-gray-500 bg-[#282828] rounded-lg hover:text-white cursor-pointer font-bold"
          aria-label="Next Test"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={onRepeatTest}
          className="flex items-center gap-2 px-6 py-3 bg-[#282828] rounded-lg hover:text-white cursor-pointer font-bold"
          aria-label="Repeat Test"
        >
          <RefreshCw size={20} />
        </button>
        <button
          onClick={() => setShowWordHistory(!showWordHistory)}
          className="flex items-center gap-2 px-6 py-3 bg-[#282828] rounded-lg hover:text-white cursor-pointer font-bold transition-colors"
          aria-label="Toggle Words History"
        >
          <History size={20} />
        </button>
      </div>
    </div>
  );
};

export default TestResults;
