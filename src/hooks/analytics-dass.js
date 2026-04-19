import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';

/* ---------- test count common ---------- */

export async function fetchDassTestCountCommon({ period, team_ids }) {
    const res = await authFetch('/dass_analytics/test_count_common', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ period, team_ids }),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export function useDassTestCountCommon(period, team_ids = []) {
    const [testCount, setTestCount] = useState(null);
    const [loadingTestCount, setLoadingTestCount] = useState(true);
    const [errorTestCount, setErrorTestCount] = useState(null);

    useEffect(() => {
        fetchDassTestCountCommon({ period, team_ids })
            .then(setTestCount)
            .catch(() => setErrorTestCount(true))
            .finally(() => setLoadingTestCount(false));
    }, [period, JSON.stringify(team_ids)]);

    return { testCount, loadingTestCount, errorTestCount };
}

/* ---------- risk categories ---------- */

export async function fetchRiskCategories({ period, team_ids }) {
    const res = await authFetch('/dass_analytics/risk_categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ period, team_ids }),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export function useRiskCategories(period, team_ids = []) {
    const [riskData, setRiskData] = useState(null);
    const [loadingRiskData, setLoadingRiskData] = useState(true);
    const [errorRiskData, setErrorRiskData] = useState(null);

    useEffect(() => {
        fetchRiskCategories({ period, team_ids })
            .then(setRiskData)
            .catch(() => setErrorRiskData(true))
            .finally(() => setLoadingRiskData(false));
    }, [period, JSON.stringify(team_ids)]);

    return { riskData, loadingRiskData, errorRiskData };
}

/* ---------- testing coverage ---------- */

export async function fetchTestingCoverage({ period, team_ids }) {
    const res = await authFetch('/dass_analytics/testing_coverage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ period, team_ids }),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export function useTestingCoverage(period, team_ids = []) {
    const [coverageData, setCoverageData] = useState(null);
    const [loadingCoverage, setLoadingCoverage] = useState(true);
    const [errorCoverage, setErrorCoverage] = useState(null);

    useEffect(() => {
        fetchTestingCoverage({ period, team_ids })
            .then(setCoverageData)
            .catch(() => setErrorCoverage(true))
            .finally(() => setLoadingCoverage(false));
    }, [period, JSON.stringify(team_ids)]);

    return { coverageData, loadingCoverage, errorCoverage };
}

/* ---------- severity distribution ---------- */

export async function fetchSeverityDistribution({ period, team_ids }) {
    const res = await authFetch('/dass_analytics/severity_distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            period,
            team_ids,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка загрузки распределения по уровням тяжести');
    }

    return await res.json();
}

export function useSeverityDistribution(period, team_ids = []) {
    const [severityData, setSeverityData] = useState(null);
    const [loadingSeverityData, setLoadingSeverityData] = useState(true);
    const [errorSeverityData, setErrorSeverityData] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoadingSeverityData(true);

        fetchSeverityDistribution({ period, team_ids })
            .then(data => {
                if (isMounted) {
                    const teams = data?.teams || [];

                    setSeverityData({
                        stress: teams.map(team => ({
                            id: team.team_id,
                            label: team.team_name,
                            recommendation_trigger: team.stress?.recommendation_trigger ?? false,
                            total_members: team.total_members,
                            stress: team.stress,
                        })),
                        anxiety: teams.map(team => ({
                            id: team.team_id,
                            label: team.team_name,
                            recommendation_trigger: team.anxiety?.recommendation_trigger ?? false,
                            total_members: team.total_members,
                            anxiety: team.anxiety,
                        })),
                        depression: teams.map(team => ({
                            id: team.team_id,
                            label: team.team_name,
                            recommendation_trigger: team.depression?.recommendation_trigger ?? false,
                            total_members: team.total_members,
                            depression: team.depression,
                        })),
                    });

                    setErrorSeverityData(null);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setErrorSeverityData('Ошибка загрузки распределения по уровням тяжести');
                    setSeverityData(null);
                }
            })
            .finally(() => {
                if (isMounted) setLoadingSeverityData(false);
            });

        return () => {
            isMounted = false;
        };
    }, [period, JSON.stringify(team_ids)]);

    return {
        severityData,
        loadingSeverityData,
        errorSeverityData,
    };
}

/* ---------- teams mood distribution ---------- */

export async function fetchTeamsMoodDistribution({ period, team_ids }) {
    const res = await authFetch('/mood_analytics/teams_mood_distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            period,
            team_ids,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка загрузки распределения настроения');
    }

    return await res.json();
}

export function useTeamsMoodDistribution(period, team_ids = []) {
    const [moodData, setMoodData] = useState(null);
    const [loadingMoodData, setLoadingMoodData] = useState(true);
    const [errorMoodData, setErrorMoodData] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoadingMoodData(true);

        fetchTeamsMoodDistribution({ period, team_ids })
            .then(data => {
                if (!isMounted) return;

                const scoreMap = {
                    1: { count: 0, percent: 0 },
                    2: { count: 0, percent: 0 },
                    3: { count: 0, percent: 0 },
                    4: { count: 0, percent: 0 },
                    5: { count: 0, percent: 0 },
                };

                (data.score_distribution || []).forEach(scoreItem => {
                    const score = Number(scoreItem.score);

                    if (scoreMap[score]) {
                        scoreMap[score] = {
                            count: scoreItem.count ?? 0,
                            percent: scoreItem.percent ?? 0,
                        };
                    }
                });

                setMoodData({
                    period: data.period,
                    points: [
                        {
                            label: data.period,
                            start_date: data.start_date,
                            end_date: data.end_date,
                            total_completions: data.total_completions ?? 0,
                            recommendation_trigger: data.rec_mood_trigger ?? false,
                            scores: scoreMap,
                        }
                    ],
                });

                setErrorMoodData(null);
            })
            .catch(() => {
                if (!isMounted) return;
                setErrorMoodData('Ошибка загрузки распределения настроения');
                setMoodData(null);
            })
            .finally(() => {
                if (isMounted) setLoadingMoodData(false);
            });

        return () => {
            isMounted = false;
        };
    }, [period, JSON.stringify(team_ids)]);

    return { moodData, loadingMoodData, errorMoodData };
}

/* ---------- severity trends ---------- */

export async function fetchSeverityTrends({ period, team_ids }) {
    const res = await authFetch('/dass_analytics/severity_trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            period,
            team_ids,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка загрузки трендов тяжести');
    }

    return await res.json();
}

export function useSeverityTrends(period, team_ids = []) {
    const [severityTrends, setSeverityTrends] = useState(null);
    const [loadingSeverityTrends, setLoadingSeverityTrends] = useState(true);
    const [errorSeverityTrends, setErrorSeverityTrends] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoadingSeverityTrends(true);

        fetchSeverityTrends({ period, team_ids })
            .then(data => {
                if (!isMounted) return;

                const formatPoints = (points) =>
                    points.map(point => ({
                        period: point.period,
                        label: point.label,
                        start: point.start,
                        end: point.end,
                        Normal: point.Normal?.percent || 0,
                        Mild: point.Mild?.percent || 0,
                        Moderate: point.Moderate?.percent || 0,
                        High: point.High?.percent || 0,
                        Very_High: point.Very_High?.percent || 0,
                    }));

                setSeverityTrends({
                    depression: formatPoints(data.depression),
                    anxiety: formatPoints(data.anxiety),
                    stress: formatPoints(data.stress),
                });

                setErrorSeverityTrends(null);
            })
            .catch(() => {
                if (!isMounted) return;
                setErrorSeverityTrends('Ошибка загрузки трендов тяжести');
                setSeverityTrends(null);
            })
            .finally(() => {
                if (isMounted) setLoadingSeverityTrends(false);
            });

        return () => {
            isMounted = false;
        };
    }, [period, JSON.stringify(team_ids)]);

    return {
        severityTrends,
        loadingSeverityTrends,
        errorSeverityTrends,
    };
}

/* ---------- test count chart ---------- */

export async function fetchDassTestCount({ period, team_id }) {
    const params = new URLSearchParams({
        period,
        team_id: String(team_id),
    });

    const res = await authFetch(`/dass_analytics/test_count?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка загрузки статистики прохождений теста');
    }

    return await res.json();
}

export function useDassTestCount(period, team_id) {
    const [testCountData, setTestCountData] = useState(null);
    const [loadingTestCountData, setLoadingTestCountData] = useState(true);
    const [errorTestCountData, setErrorTestCountData] = useState(null);

    useEffect(() => {
        if (!period || !team_id) {
            setTestCountData(null);
            setLoadingTestCountData(false);
            setErrorTestCountData(null);
            return;
        }

        let isMounted = true;
        setLoadingTestCountData(true);

        fetchDassTestCount({ period, team_id })
            .then((data) => {
                if (!isMounted) return;

                const formattedPeriods = (data.periods || []).map((item) => ({
                    start: item.start,
                    end: item.end,
                    test_count: item.test_count || 0,
                    label: `${item.start} - ${item.end}`,
                }));

                setTestCountData({
                    period: data.period,
                    recommendation_trigger: data.recommendation_trigger,
                    periods: formattedPeriods,
                });

                setErrorTestCountData(null);
            })
            .catch(() => {
                if (!isMounted) return;
                setErrorTestCountData('Ошибка загрузки статистики прохождений теста');
                setTestCountData(null);
            })
            .finally(() => {
                if (isMounted) setLoadingTestCountData(false);
            });

        return () => {
            isMounted = false;
        };
    }, [period, team_id]);

    return {
        testCountData,
        loadingTestCountData,
        errorTestCountData,
    };
}

/* ---------- teams mood dynamics ---------- */

export async function fetchTeamsMoodDynamics({ period, team_id }) {
    const res = await authFetch('/mood_analytics/teams_mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            period,
            team_id,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка загрузки динамики настроения');
    }

    return await res.json();
}

export function useTeamsMoodDynamics(period, team_id) {
    const [moodDynamicsData, setMoodDynamicsData] = useState(null);
    const [loadingMoodDynamicsData, setLoadingMoodDynamicsData] = useState(true);
    const [errorMoodDynamicsData, setErrorMoodDynamicsData] = useState(null);

    useEffect(() => {
        if (!period) {
            setMoodDynamicsData(null);
            setLoadingMoodDynamicsData(false);
            setErrorMoodDynamicsData(null);
            return;
        }

        let isMounted = true;
        setLoadingMoodDynamicsData(true);

        fetchTeamsMoodDynamics({ period, team_id })
            .then((data) => {
                if (!isMounted) return;

                const firstItem = data?.items?.[0] || null;
                const points = firstItem?.points || [];

                const formattedPoints = points.map((point) => {
                    const safeScores = Array.isArray(point.scores) ? point.scores : [];

                    const scoreMap = {
                        1: { count: 0, percent: 0 },
                        2: { count: 0, percent: 0 },
                        3: { count: 0, percent: 0 },
                        4: { count: 0, percent: 0 },
                        5: { count: 0, percent: 0 },
                    };

                    safeScores.forEach((item) => {
                        const score = item?.score;
                        const count = item?.count ?? 0;

                        if (scoreMap[score]) {
                            scoreMap[score] = {
                                count,
                                percent: point.total_responses
                                    ? (count / point.total_responses) * 100
                                    : 0,
                            };
                        }
                    });

                    const average =
                        point.total_responses > 0
                            ? safeScores.reduce(
                            (sum, item) => sum + (item.score || 0) * (item.count || 0),
                            0
                        ) / point.total_responses
                            : null;

                    return {
                        label: point.period_label,
                        start_date: point.start_date,
                        end_date: point.end_date,
                        total_responses: point.total_responses ?? 0,
                        scores: scoreMap,
                        average,
                    };
                });

                setMoodDynamicsData({
                    team_id: firstItem?.team_id ?? null,
                    team_name: firstItem?.team_name ?? '',
                    recommendation_trigger: firstItem?.recommendation_trigger ?? false,
                    points: formattedPoints,
                });

                setErrorMoodDynamicsData(null);
            })
            .catch(() => {
                if (!isMounted) return;
                setErrorMoodDynamicsData('Ошибка загрузки динамики настроения');
                setMoodDynamicsData(null);
            })
            .finally(() => {
                if (isMounted) setLoadingMoodDynamicsData(false);
            });

        return () => {
            isMounted = false;
        };
    }, [period, team_id]);

    return {
        moodDynamicsData,
        loadingMoodDynamicsData,
        errorMoodDynamicsData,
    };
}



