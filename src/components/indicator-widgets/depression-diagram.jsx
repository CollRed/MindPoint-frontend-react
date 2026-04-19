import React, { useEffect, useState } from "react";
import "./depression-diagram.css";


export default function DepressionDiagram({ data }) {
    const normal = Math.round(data?.[0]?.depression?.Normal?.percent || 0);
    const mild = Math.round(data?.[0]?.depression?.Mild?.percent || 0);
    const moderate = Math.round(data?.[0]?.depression?.Moderate?.percent || 0);
    const high = Math.round(data?.[0]?.depression?.High?.percent || 0);
    const veryHigh = Math.round(data?.[0]?.depression?.Very_High?.percent || 0);
    const hasRecommendationTrigger = data?.some(
        (item) => item.recommendation_trigger === true
    );

    const [animatedValues, setAnimatedValues] = useState({
        normal: 0,
        mild: 0,
        moderate: 0,
        high: 0,
        veryHigh: 0,
    });

    useEffect(() => {
        const targets = {
            normal,
            mild,
            moderate,
            high,
            veryHigh,
        };

        const interval = setInterval(() => {
            setAnimatedValues(prev => {
                const next = { ...prev };

                let finished = true;

                Object.keys(targets).forEach(key => {
                    if (prev[key] < targets[key]) {
                        next[key] = prev[key] + 1;
                        finished = false;
                    } else if (prev[key] > targets[key]) {
                        next[key] = prev[key] - 1;
                        finished = false;
                    }
                });

                if (finished) {
                    clearInterval(interval);
                }

                return next;
            });
        }, 25);

        return () => clearInterval(interval);
    }, [normal, mild, moderate, high, veryHigh]);
    return (
        <div className={`stress-diagram-body ${hasRecommendationTrigger ? "error" : ""}`}>
            <div className="stress-diagram-text">% сотрудников в каждой категории</div>
            <div className="stress-diagram-main">
                <div className="stress-diagram-number">
                    <div className="diagram-number-100">100</div>
                    <div className="diagram-number-75">75</div>
                    <div className="diagram-number-50">50</div>
                    <div className="diagram-number-25">25</div>
                    <div className="diagram-number-0">0</div>
                </div>
                <div className="stress-diagram-stroka">
                    <div className="stroka-number-100"></div>
                    <div className="stroka-number-75"></div>
                    <div className="stroka-number-50"></div>
                    <div className="stroka-number-25"></div>
                    <div className="stroka-number-0"></div>
                    <div className="stress-diagram-bar">
                        <div className="stress-bar-wrap">
                            <div
                                className="bar bar-normal"
                                style={{
                                    height: `${animatedValues.normal}%`,
                                    minHeight: animatedValues.normal === 0 ? "1px" : undefined,
                                }}
                            >
                                <div className="bar-label">{animatedValues.normal}%</div>
                                <div className="bar-value">{data?.[0]?.depression?.Normal?.members} чел</div>
                            </div>
                        </div>

                        <div className="stress-bar-wrap">
                            <div
                                className="bar bar-mild"
                                style={{
                                    height: `${animatedValues.mild}%`,
                                    minHeight: animatedValues.mild === 0 ? "1px" : undefined,
                                }}
                            >
                                <div className="bar-label">{animatedValues.mild}%</div>
                                <div className="bar-value">{data?.[0]?.depression?.Mild?.members} чел</div>

                            </div>
                        </div>

                        <div className="stress-bar-wrap">
                            <div
                                className="bar bar-moderate"
                                style={{
                                    height: `${animatedValues.moderate}%`,
                                    minHeight: animatedValues.moderate === 0 ? "1px" : undefined,
                                }}
                            >
                                <div className="bar-label">{animatedValues.moderate}%</div>
                                <div className="bar-value">{data?.[0]?.depression?.Moderate?.members} чел</div>
                            </div>
                        </div>

                        <div className="stress-bar-wrap">
                            <div
                                className={`bar bar-high ${high >= 20 ? "bar-danger" : ""}`}
                                style={{
                                    height: `${animatedValues.high}%`,
                                    minHeight: animatedValues.high === 0 ? "1px" : undefined,
                                }}
                            >
                                <div className="bar-label">{animatedValues.high}%</div>
                                <div className="bar-value">{data?.[0]?.depression?.High?.members} чел</div>
                            </div>
                        </div>

                        <div className="stress-bar-wrap">
                            <div
                                className={`bar bar-very-high ${animatedValues.veryHigh >= 20 ? "bar-danger" : ""}`}
                                style={{
                                    height: `${animatedValues.veryHigh}%`,
                                    minHeight: animatedValues.veryHigh === 0 ? "1px" : undefined,
                                }}
                            >
                                <div className="bar-label">{animatedValues.veryHigh}%</div>
                                <div className="bar-value">{data?.[0]?.depression?.Very_High?.members} чел</div>
                            </div>
                        </div>
                    </div>
                    <div className="mini-stroka">
                        <div className="mini-stroka1"></div>
                        <div className="mini-stroka1"></div>
                        <div className="mini-stroka1"></div>
                        <div className="mini-stroka1"></div>
                        <div className="mini-stroka1"></div>
                    </div>
                    <div className="diagram-status">
                        <div className="diagram-status-normal">Норма</div>
                        <div className="diagram-status-low">Низкий</div>
                        <div className="diagram-status-moderate">Умеренный</div>
                        <div className="diagram-status-high">Высокий</div>
                        <div className="diagram-status-very-high">Очень высокий</div>
                    </div>
                </div>
            </div>
        </div>
    )
}