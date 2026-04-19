import React, { useEffect, useState } from "react";
import "./count-test.css";

export default function CountTest({ data }) {
    const [hoveredBar, setHoveredBar] = useState(null);
    const [animateBars, setAnimateBars] = useState(false);


    const periods = data?.periods || [];

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            setAnimateBars(true);
        });

        return () => cancelAnimationFrame(id);
    }, [data]);

    const maxBackendValue = Math.max(
        ...periods.map((item) => item.test_count || 0),
        0
    );

    const rawAxisMax = maxBackendValue > 0 ? maxBackendValue / 0.9 : 10;
    const axisStep = Math.max(1, Math.ceil(rawAxisMax / 5));
    const axisMax = axisStep * 5;

    const yAxisValues = [
        axisMax,
        axisMax - axisStep,
        axisMax - axisStep * 2,
        axisMax - axisStep * 3,
        axisMax - axisStep * 4,
        0,
    ];

    const formatLabel = (point, period) => {
        const start = new Date(point.start);
        const end = new Date(point.end);

        const ddmm = (date) =>
            date.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
            });

        if (period === "week") {
            return {
                line1: `${ddmm(start)} - ${ddmm(end)}`,
                line2: "",
            };
        }

        if (period === "month") {
            const format = (date) => {
                const dayMonth = date.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                });

                const yearShort = String(date.getFullYear()).slice(-2);

                return `${dayMonth}.${yearShort}`;
            };

            return {
                line1: format(start),
                line2: format(end),
            };
        }

        if (period === "year") {
            return {
                line1: String(start.getFullYear()),
                line2: "",
            };
        }

        return { line1: "", line2: "" };
    };

    const labels = periods.map((point) => formatLabel(point, data?.period));
    const totalCount = periods.reduce((sum, item) => sum + (item.test_count || 0), 0);
    const [animatedTotal, setAnimatedTotal] = useState(0);

    useEffect(() => {
        let frameId;

        const startValue = animatedTotal; // текущее значение
        const endValue = totalCount;      // новое значение
        const duration = 800;

        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const rawProgress = Math.min(elapsed / duration, 1);

            // ease
            const progress = 1 - Math.pow(1 - rawProgress, 3);

            const nextValue = Math.round(
                startValue + (endValue - startValue) * progress
            );

            setAnimatedTotal(nextValue);

            if (rawProgress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frameId);
    }, [totalCount]);
    const chartHeight = 202;

    const getBarHeight = (value) => {
        if (!axisMax) return 1;

        const calculatedHeight = (value / axisMax) * chartHeight;
        return Math.max(calculatedHeight, 2);
    };

    return (
        <div className="count-test-widget">
            <div className="test-widget-text">Количество прохождений</div>
            <div className="test-widget-count">{animatedTotal}</div>

            <div className="test-widget-main">
                <div className="test-widget-number">
                    {yAxisValues.map((value, index) => (
                        <div className="test-widget-number-item" key={index}>
                            {value}
                        </div>
                    ))}
                </div>

                <div className="test-widget-grid-block">
                    <div className="test-widget-graph-area">
                        <div className="test-widget-stroka">
                            {yAxisValues.map((_, index) => (
                                <div className="test-widget-grid-line" key={index}></div>
                            ))}
                        </div>

                        <div className="test-widget-bars">
                            {periods.map((item, index) => {
                                const isHovered = hoveredBar === index;
                                const rawValue = item.test_count || 0;

                                return (
                                    <div className="test-widget-bar-wrap" key={index}>
                                        <div
                                            className={`test-widget-bar ${isHovered ? "active" : ""} ${animateBars ? "animate" : ""}`}
                                            style={{
                                                height: animateBars
                                                    ? `${getBarHeight(rawValue)}px`
                                                    : "1px",
                                            }}
                                            onMouseEnter={() => setHoveredBar(index)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                        >
                                            <div className={`test-widget-tooltip ${isHovered ? "visible" : ""}`}>
                                                {rawValue}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="test-widget-x-axis">
                        {labels.map((label, index) => (
                            <div
                                className="test-widget-x-label"
                                key={`${label.line1}-${label.line2}-${index}`}
                            >
                                <div>{label.line1}</div>
                                {label.line2 && <div>{label.line2}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}