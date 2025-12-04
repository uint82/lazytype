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
  currentThemeKey,
  sessionTime,
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

  const [hoveredButton, setHoveredButton] = useState(null);

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

  // Add this helper function at the top of TestResults.jsx (around line 70-80)
  const formatSessionTime = (milliseconds) => {
    const totalSeconds = Math.round(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
            stroke="var(--error)"
            strokeWidth={2}
          />
          <line
            x1={cx - 4}
            y1={cy + 4}
            x2={cx + 4}
            y2={cy - 4}
            stroke="var(--error)"
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
          className="backdrop-blur-md rounded-xl shadow-lg p-3 text-xs space-y-1.5"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border)",
            borderWidth: "1px",
            color: "var(--text-primary)",
            minWidth: "150px",
          }}
        >
          <div
            className="flex justify-between text-[11px] pb-1 mb-1"
            style={{
              borderBottom: `1px solid var(--border)`,
              color: "var(--text-muted)",
            }}
          >
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
                <span style={{ color: "var(--error)" }}>Errors</span>
                <span style={{ color: "var(--error)" }}>{data.errorCount}</span>
              </div>
            )}
            {visibleLines.wpm && (
              <div className="flex justify-between">
                <span style={{ color: "var(--text-correct)" }}>WPM</span>
                <span style={{ color: "var(--text-correct)" }}>{data.wpm}</span>
              </div>
            )}
            {visibleLines.rawWpm && (
              <div className="flex justify-between">
                <span style={{ color: "var(--text-current)" }}>Raw WPM</span>
                <span style={{ color: "var(--text-current)" }}>
                  {data.rawWpm}
                </span>
              </div>
            )}
            {visibleLines.burst && (
              <div className="flex justify-between">
                <span style={{ color: "var(--text-dim)" }}>Burst</span>
                <span style={{ color: "var(--text-dim)" }}>{data.burst}</span>
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
              <div
                className="text-[2rem]"
                style={{ color: "var(--text-muted)" }}
              >
                wpm
              </div>
              <TooltipHover
                text={`${stats.wpmExact?.toFixed(2)} wpm`}
                currentThemeKey={currentThemeKey}
              >
                <div
                  className="text-[4rem] -mt-6 -mb-6"
                  style={{ color: "var(--text-correct)" }}
                >
                  {stats.wpm >= 1000 ? "Infinite" : stats.wpm}
                </div>
              </TooltipHover>
            </div>
            <div className="md:text-left text-center">
              <div
                className="text-[2rem]"
                style={{ color: "var(--text-muted)" }}
              >
                acc
              </div>
              <TooltipHover
                text={
                  <>
                    <div style={{ color: "var(--text-primary)" }}>
                      {stats.accuracyExact?.toFixed(2)}%
                    </div>
                    <div style={{ color: "var(--text-correct)" }}>
                      {stats.totalCorrected} correct
                    </div>
                    <div style={{ color: "var(--error)" }}>
                      {stats.totalMistakes} incorrect
                    </div>
                  </>
                }
                currentThemeKey={currentThemeKey}
              >
                <div
                  className="text-[4rem] -mt-6"
                  style={{ color: "var(--info)" }}
                >
                  {stats.accuracy}%
                </div>
              </TooltipHover>
            </div>
          </div>
          {/* graph */}
          <div
            className="flex-1 rounded-lg mt-4 relative group breakout transition-colors duration-300"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            {/* legend */}
            <div
              className="absolute bottom-1 right-0 z-10 opacity-0 group-hover:opacity-100 transition-colors duration-300 backdrop-blur-sm rounded-lg pointer-events-none"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div className="flex flex-row gap-3 text-[11px] p-2">
                <button
                  onClick={() => toggleLine("wpm")}
                  tabIndex={-1}
                  className="flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md hover:bg-black/20"
                  style={{
                    color: !visibleLines.wpm
                      ? "var(--text-primary)"
                      : "var(--text-correct)",
                    textDecoration: !visibleLines.wpm ? "line-through" : "none",
                  }}
                >
                  <div
                    className="w-5 h-0.5 transition-colors"
                    style={{
                      backgroundColor: !visibleLines.wpm
                        ? "var(--text-muted)"
                        : "var(--text-correct)",
                    }}
                  />
                  <span
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    wpm
                  </span>
                </button>
                <button
                  onClick={() => toggleLine("rawWpm")}
                  tabIndex={-1}
                  className="flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md hover:bg-black/20"
                  style={{
                    color: !visibleLines.rawWpm
                      ? "var(--text-primary)"
                      : "var(--text-current)",
                    textDecoration: !visibleLines.rawWpm
                      ? "line-through"
                      : "none",
                  }}
                >
                  <div
                    className="w-5 h-[2px] transition-all"
                    style={{
                      background: !visibleLines.rawWpm
                        ? `linear-gradient(90deg,var(--text-muted) 0%,var(--text-muted) 40%,transparent 40%,transparent 60%,var(--text-muted) 60%,var(--text-muted) 100%)`
                        : `linear-gradient(90deg,var(--text-current) 0%,var(--text-current) 40%,transparent 40%,transparent 60%,var(--text-current) 60%,var(--text-current) 100%)`,
                    }}
                  />
                  <span
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    raw
                  </span>
                </button>
                <button
                  onClick={() => toggleLine("burst")}
                  tabIndex={-1}
                  className="flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md hover:bg-black/20"
                  style={{
                    color: !visibleLines.burst
                      ? "var(--text-primary)"
                      : "var(--text-dim)",
                    textDecoration: !visibleLines.burst
                      ? "line-through"
                      : "none",
                  }}
                >
                  <div
                    className="w-5 h-[3px]"
                    style={{ backgroundColor: "var(--text-dim)" }}
                  />
                  <span
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    burst
                  </span>
                </button>
                <button
                  onClick={() => toggleLine("errors")}
                  tabIndex={-1}
                  className="flex items-center gap-2 transition-all pointer-events-auto px-1 py-1 rounded-md hover:bg-black/20"
                  style={{
                    color: !visibleLines.errors
                      ? "var(--text-primary)"
                      : "var(--error)",
                    textDecoration: !visibleLines.errors
                      ? "line-through"
                      : "none",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16">
                    <line
                      x1="3"
                      y1="3"
                      x2="13"
                      y2="13"
                      stroke={
                        !visibleLines.errors
                          ? "var(--text-muted)"
                          : "var(--error)"
                      }
                      strokeWidth="2"
                    />
                    <line
                      x1="3"
                      y1="13"
                      x2="13"
                      y2="3"
                      stroke={
                        !visibleLines.errors
                          ? "var(--text-muted)"
                          : "var(--error)"
                      }
                      strokeWidth="2"
                    />
                  </svg>
                  <span
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Errors
                  </span>
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
                    <stop
                      offset="100%"
                      stopColor="var(--bg-primary)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--bg-primary)"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--text-muted)" strokeOpacity={0.1} />
                <XAxis
                  dataKey={getXAxisKey()}
                  stroke="var(--text-muted)"
                  strokeWidth={1}
                  strokeOpacity={0.1}
                  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
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
                  stroke="var(--text-muted)"
                  strokeWidth={1}
                  strokeOpacity={0.1}
                  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                  label={{
                    value: "Words per Minute",
                    angle: -90,
                    position: "insideLeft",
                    fill: "var(--text-muted)",
                    fontSize: 12,
                    style: { textAnchor: "middle" },
                    offset: 15,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--text-muted)"
                  strokeWidth={1}
                  strokeOpacity={0.1}
                  tick={
                    totalErrors > 0
                      ? { fontSize: 12, fill: "var(--text-muted)" }
                      : false
                  }
                  domain={[0, maxErrorCount]}
                  allowDecimals={false}
                  label={{
                    value: "Errors",
                    angle: 90,
                    position: "insideRight",
                    fill: "var(--text-muted)",
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
                    stroke="var(--text-dim)"
                    isAnimationActive={false}
                    activeDot={false}
                  />
                )}
                {visibleLines.burst && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="burst"
                    stroke="var(--text-dim)"
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
                    stroke="var(--text-current)"
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
                    stroke="var(--text-correct)"
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
            <div className="text-md" style={{ color: "var(--text-muted)" }}>
              test type
            </div>
            <div
              className="text-md"
              style={{ whiteSpace: "pre-line", color: "var(--text-dim)" }}
            >
              {formatTestType()}
            </div>
          </div>
          <div className="text-left">
            <div className="text-md" style={{ color: "var(--text-muted)" }}>
              raw
            </div>
            <TooltipHover
              text={`${stats.rawWpmExact?.toFixed(2)} wpm`}
              currentThemeKey={currentThemeKey}
            >
              <div
                className="text-2xl sm:text-3xl"
                style={{ color: "var(--primary)" }}
              >
                {stats.rawWpm}
              </div>
            </TooltipHover>
          </div>
          <div className="text-left">
            <div className="text-md" style={{ color: "var(--text-muted)" }}>
              characters
            </div>
            <TooltipHover
              currentThemeKey={currentThemeKey}
              text={
                <>
                  <div style={{ color: "var(--text-correct)" }}>
                    {stats.correctChars} correct
                  </div>
                  <div style={{ color: "var(--text-incorrect)" }}>
                    {stats.incorrectChars} incorrect
                  </div>
                  <div style={{ color: "var(--text-current)" }}>
                    {stats.extraChars} extra
                  </div>
                  <div style={{ color: "var(--text-muted)" }}>
                    {stats.missedChars} missed
                  </div>
                </>
              }
            >
              <div
                className="text-2xl sm:text-3xl font-mono"
                style={{ color: "var(--primary)" }}
              >
                {stats.correctChars}/{stats.incorrectChars}/{stats.extraChars}/
                {stats.missedChars}
              </div>
            </TooltipHover>
          </div>
          <div className="text-left">
            <div className="text-md" style={{ color: "var(--text-muted)" }}>
              consistency
            </div>
            <TooltipHover
              text={`${stats.consistencyExact.toFixed(2)}%`}
              currentThemeKey={currentThemeKey}
            >
              <div
                className="text-2xl sm:text-3xl"
                style={{ color: "var(--primary)" }}
              >
                {stats.consistency}%
              </div>
            </TooltipHover>
          </div>
          <div className="text-left">
            <div className="text-md" style={{ color: "var(--text-muted)" }}>
              time
            </div>
            <TooltipHover
              text={`${(timeElapsed / 1000).toFixed(2)}s`}
              currentThemeKey={currentThemeKey}
            >
              <div
                className="text-2xl sm:text-3xl"
                style={{ color: "var(--primary)" }}
              >
                {formatTime(timeElapsed)}
              </div>
            </TooltipHover>
            <div
              className="text-[12px] mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {formatSessionTime(sessionTime)} session
            </div>
          </div>
          {isQuoteMode && quote?.source && (
            <div className="text-left">
              <div className="text-md" style={{ color: "var(--text-muted)" }}>
                source
              </div>
              <div
                className="text-md font-medium italic"
                style={{ color: "var(--text-correct)" }}
              >
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
        currentThemeKey={currentThemeKey}
      />

      <div className="flex gap-4 justify-center mt-4">
        {[
          {
            id: "next",
            icon: ChevronRight,
            action: handleNextTest,
            label: "Next Test",
          },
          {
            id: "repeat",
            icon: RefreshCw,
            action: onRepeatTest,
            label: "Repeat Test",
          },
          {
            id: "history",
            icon: History,
            action: () => setShowWordHistory(!showWordHistory),
            label: "Toggle History",
          },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={btn.action}
            onMouseEnter={() => setHoveredButton(btn.id)}
            onMouseLeave={() => setHoveredButton(null)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer font-bold transition-colors duration-300"
            style={{
              backgroundColor: "var(--bg-primary)",
              color:
                hoveredButton === btn.id
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
            }}
            aria-label={btn.label}
          >
            <btn.icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
