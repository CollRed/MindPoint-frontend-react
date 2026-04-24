import React, { useState } from "react";
import "./anxiety-chart.css";

export default function StressChart({ data = [], teamId, period, hasRightRecommendationTrigger = false }) {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [activeCategories, setActiveCategories] = useState([]);
    const teamKey = teamId || "all";

    const formatLabel = (point, period) => {
        const start = new Date(point.start);
        const end = new Date(point.end);

        if (period === "week") {
            return {
                line1: start.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                }),
                line2: "",
            };
        }

        if (period === "month") {
            const startDay = start.getDate();
            const endDay = end.getDate();
            const month = String(start.getMonth() + 1).padStart(2, "0");

            return {
                line1: `${startDay}.${month} - ${endDay}.${month}`,
                line2: "",
            };
        }

        if (period === "year") {
            const months = [
                "ЯНВ", "ФЕВ", "МАР", "АПР", "МАЙ", "ИЮН",
                "ИЮЛ", "АВГ", "СЕН", "ОКТ", "НОЯ", "ДЕК"
            ];

            const month = months[start.getMonth()];
            const year = start.getFullYear();

            return {
                line1: month,
                line2: String(year),
            };
        }

        return { line1: "", line2: "" };
    };

    const labels = data.map((point) => formatLabel(point, period));

    const chartWidth = 573;
    const chartHeight = 223;

    const getPaddingX = () => {
        if (period === "week") return 20;
        if (period === "month") return 30;
        if (period === "year") return 15;
        return 20;
    };

    const getX = (index, total) => {
        const padding = getPaddingX();

        if (total <= 1) return padding;

        const usableWidth = chartWidth - padding * 2;
        return padding + (index / (total - 1)) * usableWidth;
    };

    const getY = (value) => {
        return chartHeight - (value / 100) * chartHeight;
    };

    const handleCategoryClick = (category) => {
        setHoveredPoint(null);

        setActiveCategories((prev) => {
            if (prev.includes(category)) {
                return prev.filter((item) => item !== category);
            }

            return [...prev, category];
        });
    };

    const renderPoints = (values, pointClass, color) =>
        values.map((value, index) => {
            const x = getX(index, values.length);
            const y = getY(value);

            return (
                <g
                    key={`${pointClass}-${index}`}
                    className="stress-point-group"
                    onMouseEnter={() => setHoveredPoint({ x, y, value, color })}
                    onMouseLeave={() => setHoveredPoint(null)}
                >
                    <circle
                        cx={x}
                        cy={y}
                        r="12"
                        className="stress-point-hover-area"
                    />
                    <circle
                        cx={x}
                        cy={y}
                        r="5"
                        className={pointClass}
                    />
                </g>
            );
        });

    const buildSmoothPath = (values) => {
        if (!values.length) return "";

        const points = values.map((value, index) => ({
            x: getX(index, values.length),
            y: getY(value),
        }));

        if (points.length === 1) {
            return `M 0 ${points[0].y} L ${chartWidth} ${points[0].y}`;
        }

        const extendedPoints = [
            { x: 0, y: points[0].y },
            ...points,
            { x: chartWidth, y: points[points.length - 1].y },
        ];

        let path = `M ${extendedPoints[0].x} ${extendedPoints[0].y}`;

        for (let i = 0; i < extendedPoints.length - 1; i++) {
            const current = extendedPoints[i];
            const next = extendedPoints[i + 1];

            const controlX1 = current.x + (next.x - current.x) / 2;
            const controlY1 = current.y;

            const controlX2 = current.x + (next.x - current.x) / 2;
            const controlY2 = next.y;

            path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
        }

        return path;
    };

    const round = (val) => Math.round(val ?? 0);

    const normalValues = data.map((point) => round(point.Normal));
    const lowValues = data.map((point) => round(point.Mild));
    const mediumValues = data.map((point) => round(point.Moderate));
    const highValues = data.map((point) => round(point.High));
    const veryHighValues = data.map((point) => round(point.Very_High));

    const showAll = activeCategories.length === 0;

    const showNormal = showAll || activeCategories.includes("normal");
    const showLow = showAll || activeCategories.includes("low");
    const showMedium = showAll || activeCategories.includes("medium");
    const showHigh = showAll || activeCategories.includes("high");
    const showVeryHigh = showAll || activeCategories.includes("very-high");

    const isDimmed = (category) =>
        activeCategories.length > 0 && !activeCategories.includes(category);

    const labelsKey = labels.map((label) => `${label.line1}-${label.line2}`).join("_");
    const activeKey = activeCategories.join("_") || "all";

    return (
        <>
            <div className={`stress-chart-body ${hasRightRecommendationTrigger ? "error" : ""}`}>
                <div className="stress-chart-text">% сотрудников в каждой категории</div>
                <div className="stress-chart-main">
                    <div className="stress-chart-left">
                        <div
                            className={`stress-chart-left-item ${isDimmed("normal") ? "dimmed" : ""}`}
                            onClick={() => handleCategoryClick("normal")}
                        >
                            <div className="stress-chart-normal-color"></div>
                            <div className="stress-chart-normal">Норма</div>
                        </div>

                        <div
                            className={`stress-chart-left-item ${isDimmed("low") ? "dimmed" : ""}`}
                            onClick={() => handleCategoryClick("low")}
                        >
                            <div className="stress-chart-low-color"></div>
                            <div className="stress-chart-low">Низкий</div>
                        </div>

                        <div
                            className={`stress-chart-left-item ${isDimmed("medium") ? "dimmed" : ""}`}
                            onClick={() => handleCategoryClick("medium")}
                        >
                            <div className="stress-chart-medium-color"></div>
                            <div className="stress-chart-medium">Умеренный</div>
                        </div>

                        <div
                            className={`stress-chart-left-item ${isDimmed("high") ? "dimmed" : ""}`}
                            onClick={() => handleCategoryClick("high")}
                        >
                            <div className="stress-chart-high-color"></div>
                            <div className="stress-chart-high">Высокий</div>
                        </div>

                        <div
                            className={`stress-chart-left-item ${isDimmed("very-high") ? "dimmed" : ""}`}
                            onClick={() => handleCategoryClick("very-high")}
                        >
                            <div className="stress-chart-very-high-color"></div>
                            <div className="stress-chart-very-high">Очень Высокий</div>
                        </div>
                    </div>

                    <div className="stress-chart-right">
                        <div className="stress-chart-number">
                            <div className="chart-number-100">100</div>
                            <div className="chart-number-75">75</div>
                            <div className="chart-number-50">50</div>
                            <div className="chart-number-25">25</div>
                            <div className="chart-number-0">0</div>
                        </div>

                        <div className="stress-chart-grid-block">
                            <div className="stress-chart-graph-area">
                                <div className="stress-chart-stroka">
                                    <div className="chart-stroka-number-100"></div>
                                    <div className="chart-stroka-number-75"></div>
                                    <div className="chart-stroka-number-50"></div>
                                    <div className="chart-stroka-number-25"></div>
                                    <div className="chart-stroka-number-0"></div>
                                </div>

                                <svg
                                    className="stress-chart-svg"
                                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                    preserveAspectRatio="none"
                                >
                                    {showNormal && (
                                        <>
                                            <path
                                                key={`normal-${teamKey}-${labelsKey}-${activeKey}`}
                                                d={buildSmoothPath(normalValues)}
                                                className="stress-line stress-line-normal"
                                            />
                                            {renderPoints(normalValues, "stress-point stress-point-normal", "#6204EF")}
                                        </>
                                    )}

                                    {showLow && (
                                        <>
                                            <path
                                                key={`low-${teamKey}-${labelsKey}-${activeKey}`}
                                                d={buildSmoothPath(lowValues)}
                                                className="stress-line stress-line-low"
                                            />
                                            {renderPoints(lowValues, "stress-point stress-point-low", "#9169EC")}
                                        </>
                                    )}

                                    {showMedium && (
                                        <>
                                            <path
                                                key={`medium-${teamKey}-${labelsKey}-${activeKey}`}
                                                d={buildSmoothPath(mediumValues)}
                                                className="stress-line stress-line-medium"
                                            />
                                            {renderPoints(mediumValues, "stress-point stress-point-medium", "#A78BFA")}
                                        </>
                                    )}

                                    {showHigh && (
                                        <>
                                            <path
                                                key={`high-${teamKey}-${labelsKey}-${activeKey}`}
                                                d={buildSmoothPath(highValues)}
                                                className="stress-line stress-line-high"
                                            />
                                            {renderPoints(highValues, "stress-point stress-point-high", "#D7A5EF")}
                                        </>
                                    )}

                                    {showVeryHigh && (
                                        <>
                                            <path
                                                key={`very-high-${teamKey}-${labelsKey}-${activeKey}`}
                                                d={buildSmoothPath(veryHighValues)}
                                                className="stress-line stress-line-very-high"
                                            />
                                            {renderPoints(veryHighValues, "stress-point stress-point-very-high", "#C7AAD5")}
                                        </>
                                    )}

                                    {hoveredPoint && (
                                        <g className="stress-tooltip-group">
                                            <rect
                                                x={hoveredPoint.x - 16}
                                                y={hoveredPoint.y - 47}
                                                width="32"
                                                height="34"
                                                rx="2"
                                                fill={hoveredPoint.color}
                                            />
                                            <rect
                                                x={hoveredPoint.x - 4}
                                                y={hoveredPoint.y - 18}
                                                width="8"
                                                height="8"
                                                rx="2"
                                                fill={hoveredPoint.color}
                                                transform={`rotate(45 ${hoveredPoint.x} ${hoveredPoint.y - 14})`}
                                            />
                                            <text
                                                x={hoveredPoint.x}
                                                y={hoveredPoint.y - 26}
                                                textAnchor="middle"
                                                className="stress-tooltip-text"
                                            >
                                                {round(hoveredPoint.value)}
                                            </text>
                                        </g>
                                    )}
                                </svg>
                            </div>

                            <div className="stress-chart-x-axis">
                                {labels.map((label, index) => (
                                    <div
                                        className="stress-chart-x-label"
                                        key={`${label.line1}-${label.line2}-${index}`}
                                        style={{ left: `${getX(index, labels.length)}px` }}
                                    >
                                        <div>{label.line1}</div>
                                        {label.line2 && <div>{label.line2}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}