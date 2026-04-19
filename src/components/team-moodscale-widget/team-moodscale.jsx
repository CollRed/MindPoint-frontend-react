import { useEffect, useMemo, useRef, useState } from "react";
import "./team-moodscale.css";
import EmojiVeryHigh from "@assets/emoji-very-high.svg";
import EmojiHigh from "@assets/emoji-high.svg";
import EmojiMild from "@assets/emoji-mild.svg";
import EmojiNormal from "@assets/emoji-normal.svg";
import EmojiLight from "@assets/emoji-light.svg";

export default function TeamMoodscaleContent({ data = [], total = 0, dynamicPoints = [], period = "week" }) {
    const [animationProgress, setAnimationProgress] = useState(0);
    const previousTotalRef = useRef(0);
    const isFirstAnimationRef = useRef(true);
    const [animatedTotal, setAnimatedTotal] = useState(0);


    const formatDynamicLabel = (point, periodType) => {
        if (!point) return "";

        const start = point.start_date ? new Date(point.start_date) : null;
        const end = point.end_date ? new Date(point.end_date) : null;

        if (periodType === "week") {
            return point.label || "";
        }

        if (periodType === "month") {
            if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
                return point.label || "";
            }

            const startDay = String(start.getDate()).padStart(2, "0");
            const startMonth = String(start.getMonth() + 1).padStart(2, "0");
            const endDay = String(end.getDate()).padStart(2, "0");
            const endMonth = String(end.getMonth() + 1).padStart(2, "0");

            return `${startDay}.${startMonth} - ${endDay}.${endMonth}`;
        }

        if (periodType === "year") {
            if (!start || Number.isNaN(start.getTime())) {
                return { line1: point.label || "", line2: "" };
            }

            const monthNames = [
                "ЯНВ",
                "ФЕВ",
                "МАР",
                "АПР",
                "МАЙ",
                "ИЮН",
                "ИЮЛ",
                "АВГ",
                "СЕН",
                "ОКТ",
                "НОЯ",
                "ДЕК",
            ];

            return {
                line1: monthNames[start.getMonth()],
                line2: String(start.getFullYear()),
            };
        }

        return point.label || "";
    };

    const moodPercents = [0, 1, 2, 3, 4].map((index) => Math.round(data[index]?.value || 0));

    const chartWidth = 499;
    const chartHeight = 200;
    const chartBottomLabelsHeight = 30;
    const chartLevels = [5, 4, 3, 2, 1];

    const dynamicColumns = useMemo(() => {
        return dynamicPoints.map((point) => ({
            label: point.label,
            start_date: point.start_date,
            end_date: point.end_date,
            average: point.average,
            total_responses: point.total_responses,
            scores: point.scores || {
                1: { count: 0, percent: 0 },
                2: { count: 0, percent: 0 },
                3: { count: 0, percent: 0 },
                4: { count: 0, percent: 0 },
                5: { count: 0, percent: 0 },
            },
        }));
    }, [dynamicPoints]);

    const getAverageFromScores = (scores) => {
        if (!scores) return null;

        const p1 = Number(scores[1]?.percent || 0);
        const p2 = Number(scores[2]?.percent || 0);
        const p3 = Number(scores[3]?.percent || 0);
        const p4 = Number(scores[4]?.percent || 0);
        const p5 = Number(scores[5]?.percent || 0);

        const totalPercent = p1 + p2 + p3 + p4 + p5;
        if (totalPercent <= 0) return null;

        return (
            1 * p1 +
            2 * p2 +
            3 * p3 +
            4 * p4 +
            5 * p5
        ) / totalPercent;
    };

    const getLineX = (index, totalCount) => {
        if (totalCount <= 1) return chartWidth / 2;

        const sidePadding = 30;
        const usableWidth = chartWidth - sidePadding * 2;
        return sidePadding + (index / (totalCount - 1)) * usableWidth;
    };

    const getLineY = (value) => {
        if (value == null || Number.isNaN(value)) return null;

        const min = 1;
        const max = 5;
        const clamped = Math.max(min, Math.min(max, value));
        const normalized = (clamped - min) / (max - min);

        return chartHeight - normalized * chartHeight;
    };

    const buildSmoothPath = (points) => {
        if (!points.length) return "";

        if (points.length === 1) {
            return `M ${points[0].x} ${points[0].y}`;
        }

        let d = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            const controlX1 = current.x + (next.x - current.x) / 2;
            const controlY1 = current.y;

            const controlX2 = current.x + (next.x - current.x) / 2;
            const controlY2 = next.y;

            d += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
        }

        return d;
    };

    const linePoints = useMemo(() => {
        return dynamicColumns
            .map((point, index) => {
                const average = getAverageFromScores(point.scores);
                if (average == null) return null;

                return {
                    x: getLineX(index, dynamicColumns.length),
                    y: getLineY(average),
                };
            })
            .filter(Boolean);
    }, [dynamicColumns]);

    const linePath = useMemo(() => buildSmoothPath(linePoints), [linePoints]);

    const areaPath = useMemo(() => {
        if (!linePoints.length || !linePath) return "";

        const first = linePoints[0];
        const last = linePoints[linePoints.length - 1];

        return `${linePath} L ${last.x} ${chartHeight} L ${first.x} ${chartHeight} Z`;
    }, [linePath, linePoints]);

    useEffect(() => {
        let frameId;
        let startTime = null;
        const duration = 1200;

        const endValue = total ?? 0;
        const startValue = isFirstAnimationRef.current
            ? 0
            : previousTotalRef.current;

        if (startValue === endValue) {
            setAnimatedTotal(endValue);
            previousTotalRef.current = endValue;
            isFirstAnimationRef.current = false;
            return;
        }

        setAnimatedTotal(startValue);

        const animateNumber = (timestamp) => {
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            const nextValue = Math.round(
                startValue + (endValue - startValue) * eased
            );

            setAnimatedTotal(nextValue);

            if (progress < 1) {
                frameId = requestAnimationFrame(animateNumber);
            } else {
                setAnimatedTotal(endValue);
                previousTotalRef.current = endValue;
                isFirstAnimationRef.current = false;
            }
        };

        frameId = requestAnimationFrame(animateNumber);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [total]);

    useEffect(() => {
        let frameId;
        let startTime = null;
        const duration = 1500;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setAnimationProgress(eased);

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        };

        setAnimationProgress(0);
        frameId = requestAnimationFrame(animate);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [JSON.stringify(data), total]);

    const maskId = useMemo(
        () => `moodscale-reveal-mask-${Math.random().toString(36).slice(2, 9)}`,
        []
    );

    const size = 245;
    const cx = size / 2;
    const cy = size / 2;

    const outerRadius = 116;
    const innerRadius = 94;

    const roundingStroke = 15;
    const gapPx = 16;
    const minSegmentAngle = 8;

    const visibleData = useMemo(
        () => data.filter((item) => item.value > 0),
        [data]
    );
    const totalValue = visibleData.reduce((sum, item) => sum + item.value, 0);
    const activeSegmentsCount = visibleData.length;
    const effectiveGapPx = activeSegmentsCount <= 1 ? 0 : gapPx;

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees * Math.PI) / 180;

        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    const pxToAngle = (radius, px) => {
        return (px / (2 * Math.PI * radius)) * 360;
    };

    const describeFullRingPath = (centerX, centerY, outerR, innerR) => {
        const outerTop = polarToCartesian(centerX, centerY, outerR, 0);
        const outerBottom = polarToCartesian(centerX, centerY, outerR, 180);

        const innerTop = polarToCartesian(centerX, centerY, innerR, 0);
        const innerBottom = polarToCartesian(centerX, centerY, innerR, 180);

        return [
            `M ${outerTop.x} ${outerTop.y}`,
            `A ${outerR} ${outerR} 0 1 1 ${outerBottom.x} ${outerBottom.y}`,
            `A ${outerR} ${outerR} 0 1 1 ${outerTop.x} ${outerTop.y}`,
            `L ${innerTop.x} ${innerTop.y}`,
            `A ${innerR} ${innerR} 0 1 0 ${innerBottom.x} ${innerBottom.y}`,
            `A ${innerR} ${innerR} 0 1 0 ${innerTop.x} ${innerTop.y}`,
            "Z",
        ].join(" ");
    };

    const describePieLikeSegmentPath = (
        centerX,
        centerY,
        outerR,
        innerR,
        startAngle,
        endAngle,
        gapInPx
    ) => {
        const outerGapAngle = pxToAngle(outerR, gapInPx);
        const innerGapAngle = pxToAngle(innerR, gapInPx);

        const startOuterAngle = startAngle + outerGapAngle / 2;
        const endOuterAngle = endAngle - outerGapAngle / 2;

        const startInnerAngle = startAngle + innerGapAngle / 2;
        const endInnerAngle = endAngle - innerGapAngle / 2;

        if (endOuterAngle <= startOuterAngle || endInnerAngle <= startInnerAngle) {
            return null;
        }

        const startOuter = polarToCartesian(centerX, centerY, outerR, startOuterAngle);
        const endOuter = polarToCartesian(centerX, centerY, outerR, endOuterAngle);

        const endInner = polarToCartesian(centerX, centerY, innerR, endInnerAngle);
        const startInner = polarToCartesian(centerX, centerY, innerR, startInnerAngle);

        const largeArcFlagOuter = endOuterAngle - startOuterAngle > 180 ? 1 : 0;
        const largeArcFlagInner = endInnerAngle - startInnerAngle > 180 ? 1 : 0;

        return [
            `M ${startOuter.x} ${startOuter.y}`,
            `A ${outerR} ${outerR} 0 ${largeArcFlagOuter} 1 ${endOuter.x} ${endOuter.y}`,
            `L ${endInner.x} ${endInner.y}`,
            `A ${innerR} ${innerR} 0 ${largeArcFlagInner} 0 ${startInner.x} ${startInner.y}`,
            "Z",
        ].join(" ");
    };

    const describeRevealSectorPath = (
        centerX,
        centerY,
        outerR,
        startAngle,
        endAngle
    ) => {
        const safeEndAngle = Math.min(endAngle, startAngle + 359.999);

        const startPoint = polarToCartesian(centerX, centerY, outerR, startAngle);
        const endPoint = polarToCartesian(centerX, centerY, outerR, safeEndAngle);

        const largeArcFlag = safeEndAngle - startAngle > 180 ? 1 : 0;

        return [
            `M ${centerX} ${centerY}`,
            `L ${startPoint.x} ${startPoint.y}`,
            `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`,
            "Z",
        ].join(" ");
    };

    const normalizedSegments = useMemo(() => {
        if (activeSegmentsCount <= 1 || totalValue === 0) {
            return visibleData.map((item) => ({
                ...item,
                finalAngle: 360,
            }));
        }

        const rawSegments = visibleData.map((item) => ({
            ...item,
            rawAngle: (item.value / totalValue) * 360,
        }));

        const smallSegments = rawSegments.filter((item) => item.rawAngle < minSegmentAngle);
        const largeSegments = rawSegments.filter((item) => item.rawAngle >= minSegmentAngle);

        const boostedSmallTotal = smallSegments.length * minSegmentAngle;
        const rawSmallTotal = smallSegments.reduce((sum, item) => sum + item.rawAngle, 0);
        const extraNeeded = boostedSmallTotal - rawSmallTotal;

        const largeTotal = largeSegments.reduce((sum, item) => sum + item.rawAngle, 0);

        return rawSegments.map((item) => {
            if (item.rawAngle < minSegmentAngle) {
                return {
                    ...item,
                    finalAngle: minSegmentAngle,
                };
            }

            if (largeTotal <= 0) {
                return {
                    ...item,
                    finalAngle: item.rawAngle,
                };
            }

            const reduction = (item.rawAngle / largeTotal) * extraNeeded;
            const finalAngle = item.rawAngle - reduction;

            return {
                ...item,
                finalAngle,
            };
        });
    }, [activeSegmentsCount, totalValue, visibleData]);

    const finalSegments = useMemo(() => {
        let currentAngle = -90;

        return normalizedSegments.map((item, index) => {
            const fullAngle = item.finalAngle;

            const startAngle = currentAngle;
            const endAngle = currentAngle + fullAngle;

            currentAngle += fullAngle;

            let segmentGapPx = effectiveGapPx;
            let segmentStroke = roundingStroke;

            if (fullAngle <= minSegmentAngle) {
                segmentGapPx = 9;
                segmentStroke = 8;
            }

            const path = describePieLikeSegmentPath(
                cx,
                cy,
                outerRadius,
                innerRadius,
                startAngle,
                endAngle,
                segmentGapPx
            );

            if (!path) return null;

            return (
                <path
                    key={index}
                    d={path}
                    fill={item.color}
                    stroke={item.color}
                    strokeWidth={segmentStroke}
                    strokeLinejoin="round"
                    className="moodscale-segment"
                />
            );
        });
    }, [
        normalizedSegments,
        effectiveGapPx,
        roundingStroke,
        minSegmentAngle,
        cx,
        cy,
        outerRadius,
        innerRadius,
    ]);

    const revealPath = useMemo(() => {
        if (animationProgress <= 0) return null;

        const endAngle = -90 + 360 * animationProgress;

        return describeRevealSectorPath(
            cx,
            cy,
            outerRadius + 24,
            -90,
            endAngle
        );
    }, [animationProgress, cx, cy, outerRadius]);

    if (totalValue === 0) {
        return (
            <div className="team-moodscale-widget">
                <div className="team-moodscale-left">
                    <div className="moodscale-left-text">Шкала настроения</div>

                    <div className="moodscale-chart-wrapper">
                        <svg
                            width={size}
                            height={size}
                            viewBox={`0 0 ${size} ${size}`}
                            className="moodscale-chart"
                        >
                            <path
                                d={describeFullRingPath(cx, cy, outerRadius, innerRadius)}
                                fill="#EEEAFB"
                                className="moodscale-segment"
                            />
                        </svg>

                        <div className="moodscale-center">
                            <div className="moodscale-center-value">{animatedTotal}</div>
                            <div className="moodscale-center-label">прохождений</div>
                        </div>
                    </div>
                </div>

                <div className="team-moodscale-right">
                    <div className="moodscale-right-text">Динамика</div>
                </div>
            </div>
        );
    }

    return (
        <div className="team-moodscale-widget">
            <div className="team-moodscale-left">
                <div className="moodscale-left-text">Шкала настроения</div>

                <div className="moodscale-chart-wrapper">
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        className="moodscale-chart"
                    >
                        <defs>
                            <mask id={maskId}>
                                <rect x="0" y="0" width={size} height={size} fill="black" />
                                {revealPath && <path d={revealPath} fill="white" />}
                            </mask>
                        </defs>

                        {activeSegmentsCount === 1 ? (
                            <g mask="url(#moodscale-reveal-mask)">
                                <path
                                    d={describeFullRingPath(cx, cy, outerRadius, innerRadius)}
                                    fill={visibleData[0].color}
                                    stroke={visibleData[0].color}
                                    strokeWidth={roundingStroke}
                                    strokeLinejoin="round"
                                    className="moodscale-segment"
                                />
                            </g>
                        ) : (
                            <g mask={`url(#${maskId})`}>
                                {finalSegments}
                            </g>
                        )}
                    </svg>

                    <div className="moodscale-center">
                        <div className="moodscale-center-value">{animatedTotal}</div>
                        <div className="moodscale-center-label">человек</div>
                    </div>
                </div>
                <div className="moodscale-emojie">
                    {[
                        { img: EmojiVeryHigh, class: "emojie-very-high" },
                        { img: EmojiHigh, class: "emojie-high" },
                        { img: EmojiMild, class: "emojie-mild" },
                        { img: EmojiNormal, class: "emojie-normal" },
                        { img: EmojiLight, class: "emojie-light" },
                    ].map((item, index) => {
                        const percent = Math.round(data[index]?.value || 0);

                        return (
                            <div key={index} className="moodscale-emojie-item">
                                <div className="moodscale-emojie-icon-wrap">
                                    <img
                                        src={item.img}
                                        alt="emoji"
                                        className={`moodscale-emojie-icon ${item.class}`}
                                    />
                                </div>
                                <div className="emojie-percent">
                                    {percent}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="team-moodscale-right">
                <div className="moodscale-right-text">Динамика</div>

                <div className="moodscale-right-chart">
                    <div className="moodscale-right-number">
                        {chartLevels.map((level) => (
                            <div key={level} className={`moodscale-number-${level}`}>
                                {level}
                            </div>
                        ))}
                    </div>

                    <div className="moodscale-right-plot">
                        <div className="moodscale-right-stroki">
                            <div className="moodscale-stroka moodscale-stroka-5"></div>
                            <div className="moodscale-stroka moodscale-stroka-4"></div>
                            <div className="moodscale-stroka moodscale-stroka-3"></div>
                            <div className="moodscale-stroka moodscale-stroka-2"></div>
                            <div className="moodscale-stroka moodscale-stroka-1"></div>
                        </div>

                        <div className={`moodscale-dynamic-columns moodscale-dynamic-columns-${period}`}>
                            {dynamicColumns.map((point, index) => (
                                <div
                                    key={index}
                                    className={`moodscale-dynamic-column-wrap moodscale-dynamic-column-wrap-${period}`}
                                >
                                    <div className={`moodscale-dynamic-column moodscale-dynamic-column-${period}`}>
                                        {[1, 2, 3, 4, 5].map((score) => {
                                            const percent = point.scores?.[score]?.percent || 0;
                                            const hasValue = percent > 0;

                                            return (
                                                <div
                                                    key={score}
                                                    className={`moodscale-dynamic-segment moodscale-dynamic-segment-${score} ${hasValue ? "has-value" : "is-empty"}`}
                                                    style={{
                                                        height: hasValue ? `${percent}%` : "0%",
                                                        minHeight: hasValue ? "10px" : "0px",
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="moodscale-dynamic-label-wrap">
                                        <div className="moodscale-dynamic-tick"></div>

                                        <div className="moodscale-dynamic-label">
                                            {period === "year" ? (
                                                <>
                                                    <div className="moodscale-dynamic-label-top">
                                                        {formatDynamicLabel(point, period).line1}
                                                    </div>
                                                    <div className="moodscale-dynamic-label-bottom">
                                                        {formatDynamicLabel(point, period).line2}
                                                    </div>
                                                </>
                                            ) : (
                                                formatDynamicLabel(point, period)
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <svg
                            className="moodscale-dynamic-line"
                            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient id="mood-dynamic-area-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#54B8FF" stopOpacity="0.30" />
                                    <stop offset="100%" stopColor="#54B8FF" stopOpacity="0.06" />
                                </linearGradient>
                            </defs>

                            {areaPath && (
                                <path
                                    d={areaPath}
                                    fill="url(#mood-dynamic-area-gradient)"
                                />
                            )}

                            {linePath && (
                                <path
                                    d={linePath}
                                    fill="none"
                                    stroke="#2AA8FF"
                                    strokeWidth="2"
                                />
                            )}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}