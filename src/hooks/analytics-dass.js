import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';

/* ---------- test count ---------- */

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
                    // Приводим формат к удобному виду
                    const formatted = data.teams.map(team => ({
                        id: team.team_id,
                        label: team.team_name,
                        stress: team.stress,
                        anxiety: team.anxiety,
                        depression: team.depression,
                    }));
                    setSeverityData({
                        stress: formatted.map(team => ({
                            label: team.label,
                            stress: team.stress,
                        })),
                        anxiety: formatted.map(team => ({
                            label: team.label,
                            anxiety: team.anxiety,
                        })),
                        depression: formatted.map(team => ({
                            label: team.label,
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
