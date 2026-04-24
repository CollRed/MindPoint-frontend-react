import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import './home.css';
import CustomSelect from "../../components/custom/custom-select.jsx";
import PeriodSelect from "../../components/custom/period-select.jsx";
import TeamCustomSelect from "../../components/custom/team-custom-select.jsx";
import TeamPeriodSelect from "../../components/custom/team-period-select.jsx";
import Pagination from "../../components/pagination/pagination.jsx";
import StressContent from "../../components/risk-widget/stress-content.jsx";
import AnxietyContent from "../../components/risk-widget/anxiety-content.jsx";
import DepressionContent from "../../components/risk-widget/depression-content.jsx";
import StressDiagram from "../../components/indicator-widgets/stress-diagram.jsx";
import AnxietyDiagram from "../../components/indicator-widgets/anxiety-diagram.jsx";
import DepressionDiagram from "../../components/indicator-widgets/depression-diagram.jsx";
import StressChart from "../../components/indicator-widgets/stress-chart.jsx";
import AnxietyChart from "../../components/indicator-widgets/anxiety-chart.jsx";
import DepressionChart from "../../components/indicator-widgets/depression-chart.jsx";
import CountTest from "../../components/count-test-widget/count-test.jsx";
import DiagramStressTrigger from "../../components/recommendation-trigger/diagram-stress-trigger.jsx";
import DiagramDepressionTrigger from "../../components/recommendation-trigger/diagram-depression-trigger.jsx";
import DiagramAnxietyTrigger from "../../components/recommendation-trigger/diagram-anxiety-trigger.jsx";
import TeamMoodscaleContent from "../../components/team-moodscale-widget/team-moodscale.jsx";
import ChartStressTrigger from "../../components/recommendation-trigger/chart-stress-trigger.jsx";
import ChartDepressionTrigger from "../../components/recommendation-trigger/chart-depression-trigger.jsx";
import ChartAnxietyTrigger from "../../components/recommendation-trigger/chart-anxiety-trigger.jsx";
import CountTestTrigger from "../../components/recommendation-trigger/count-test-trigger.jsx";
import {
    fetchTeams,
} from "../../hooks/management.js";
import {
    useDassTestCountCommon,
    useRiskCategories,
    useTestingCoverage,
    useSeverityDistribution,
    useTeamsMoodDistribution,
    useSeverityTrends,
    useDassTestCount,
    useTeamsMoodDynamics
} from "../../hooks/analytics-dass.js";
import pychaHome from "@assets/home-pucha.svg";
import indicatorLine from "@assets/team-slider.svg";
import Sphera from "@assets/Sphera.jsx";
import veryFunnySmile from "@assets/very-funny-smile.svg";
import lightSmile from "@assets/light-smile.svg";
import mediumSmile from "@assets/moderate-smile.svg";
import sadSmile from "@assets/sad-smile.svg";
import verySadSmile from "@assets/very-sad-smile.svg";
import bigError from "@assets/big-error.svg";


function HomePage() {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') || 'general';
    });

    const [activeType, setActiveType] = useState('stress');
    const [employeeActiveType, setEmployeeActiveType] = useState('stress');
    const [rightActiveType, setRightActiveType] = useState('stress');
    const [teams, setTeams] = useState([]);
    const [selectedGeneralTeamIds, setSelectedGeneralTeamIds] = useState([]);
    const [selectedTeamTabId, setSelectedTeamTabId] = useState(null);

    const [generalPeriod, setGeneralPeriod] = useState('week');
    const [teamPeriod, setTeamPeriod] = useState('week');

    const [activeTrigger, setActiveTrigger] = useState(null);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
    };

    const handleGeneralPeriodChange = (period) => {
        setGeneralPeriod(period);
    };

    const handleTeamPeriodChange = (period) => {
        setTeamPeriod(period);
    }

    const currentGeneralPeriod = generalPeriod || 'week';
    const currentTeamPeriod = teamPeriod || 'week';

    const { moodData: generalMoodData, loadingMoodData: loadingGeneralMoodData } =
        useTeamsMoodDistribution(currentGeneralPeriod, selectedGeneralTeamIds);

    const { moodData: teamMoodData, loadingMoodData: loadingTeamMoodData } =
        useTeamsMoodDistribution(
            currentTeamPeriod,
            selectedTeamTabId ? [selectedTeamTabId] : []
        );

    const generalCurrentPoint =
        generalMoodData?.points?.length
            ? generalMoodData.points[generalMoodData.points.length - 1]
            : null;

    const generalScores = generalCurrentPoint?.scores || {};

    const generalP1 = generalScores[1]?.percent || 0;
    const generalP2 = generalScores[2]?.percent || 0;
    const generalP3 = generalScores[3]?.percent || 0;
    const generalP4 = generalScores[4]?.percent || 0;
    const generalP5 = generalScores[5]?.percent || 0;

    const moodColors = ["#DDD6FE", "#CFC4FA", "#B9A7F6", "#9A77F0", "#8B5CF6"];

    const teamCurrentPoint =
        teamMoodData?.points?.length
            ? teamMoodData.points[teamMoodData.points.length - 1]
            : null;

    const teamScores = teamCurrentPoint?.scores || {};

    const moodChartData = [1, 2, 3, 4, 5].map((score, index) => ({
        value: teamScores[score]?.percent || 0,
        count: teamScores[score]?.count || 0,
        color: moodColors[index],
    }));

    const moodTotal = teamCurrentPoint?.total_completions || 0;

    const indicatorTabsRef = useRef({});
    const [indicatorSliderStyle, setIndicatorSliderStyle] = useState({
        width: 0,
        left: 0,
        opacity: 0,
    });

    const rightIndicatorTabsRef = useRef({});
    const [rightIndicatorSliderStyle, setRightIndicatorSliderStyle] = useState({
        width: 0,
        left: 0,
        opacity: 0,
    });

    const employeeTabsRef = useRef({});
    const [employeeSliderStyle, setEmployeeSliderStyle] = useState({
        width: 0,
        left: 0,
        opacity: 0,
    });

    const mainTabsRef = useRef({});
    const [mainSliderStyle, setMainSliderStyle] = useState({
        width: 0,
        left: 0,
        opacity: 0,
    });


    const {
        severityData: generalSeverityData,
        loadingSeverityData: loadingGeneralSeverityData,
        errorSeverityData: errorGeneralSeverityData
    } = useSeverityDistribution(currentGeneralPeriod, selectedGeneralTeamIds);

    const {
        severityData: teamSeverityData,
        loadingSeverityData: loadingTeamSeverityData,
        errorSeverityData: errorTeamSeverityData
    } = useSeverityDistribution(
        currentTeamPeriod,
        selectedTeamTabId ? [selectedTeamTabId] : []
    );

    const { severityTrends } =
        useSeverityTrends(
            currentTeamPeriod,
            selectedTeamTabId ? [selectedTeamTabId] : []
        );

    const {
        testCountData,
        loadingTestCountData,
        errorTestCountData,
    } = useDassTestCount(currentTeamPeriod, selectedTeamTabId);



    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const {
        coverageData,
        loadingCoverage,
        errorCoverage
    } = useTestingCoverage(currentGeneralPeriod, selectedGeneralTeamIds);

    const totalPages = Math.ceil((coverageData?.teams?.length || 0) / rowsPerPage);

    const paginatedTeams = coverageData?.teams?.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    const [currentRiskPage, setCurrentRiskPage] = useState(1);
    const riskRowsPerPage = 11;

    const stressData = generalSeverityData?.stress || [];
    const paginatedStress = stressData.slice(
        (currentRiskPage - 1) * riskRowsPerPage,
        currentRiskPage * riskRowsPerPage
    );

    const depressionData = generalSeverityData?.depression || [];
    const paginatedDepression = depressionData.slice(
        (currentRiskPage - 1) * riskRowsPerPage,
        currentRiskPage * riskRowsPerPage
    );

    const anxietyData = generalSeverityData?.anxiety || [];
    const paginatedAnxiety = anxietyData.slice(
        (currentRiskPage - 1) * riskRowsPerPage,
        currentRiskPage * riskRowsPerPage
    );
    const totalRiskPages = Math.ceil(stressData.length / riskRowsPerPage)

    const {
        moodDynamicsData,
        loadingMoodDynamicsData,
        errorMoodDynamicsData,
    } = useTeamsMoodDynamics(currentTeamPeriod, selectedTeamTabId);



    const {
        testCount,
        loadingTestCount,
        errorTestCount
    } = useDassTestCountCommon(currentGeneralPeriod, selectedGeneralTeamIds);

    const {
        riskData: generalRiskData,
        loadingRiskData: loadingGeneralRiskData,
        errorRiskData: errorGeneralRiskData,
    } = useRiskCategories(currentGeneralPeriod, selectedGeneralTeamIds);

    const {
        riskData: teamRiskData,
        loadingRiskData: loadingTeamRiskData,
        errorRiskData: errorTeamRiskData,
    } = useRiskCategories(
        currentTeamPeriod,
        selectedTeamTabId ? [selectedTeamTabId] : []
    );


    const generalTotalRisk = {
        stress: 0,
        anxiety: 0,
        depression: 0,
    };

    if (generalRiskData?.teams?.length > 0) {
        const teams = generalRiskData.teams;
        const count = teams.length;

        generalTotalRisk.stress = Math.round(
            teams.reduce((sum, team) => sum + (team.stress?.risk_percent || 0), 0) / count
        );

        generalTotalRisk.anxiety = Math.round(
            teams.reduce((sum, team) => sum + (team.anxiety?.risk_percent || 0), 0) / count
        );

        generalTotalRisk.depression = Math.round(
            teams.reduce((sum, team) => sum + (team.depression?.risk_percent || 0), 0) / count
        );
    }

    const teamTotalRisk = {
        stress: 0,
        anxiety: 0,
        depression: 0,
    };

    if (teamRiskData?.teams?.length > 0) {
        const teams = teamRiskData.teams;
        const count = teams.length;

        teamTotalRisk.stress = Math.round(
            teams.reduce((sum, team) => sum + (team.stress?.risk_percent || 0), 0) / count
        );

        teamTotalRisk.anxiety = Math.round(
            teams.reduce((sum, team) => sum + (team.anxiety?.risk_percent || 0), 0) / count
        );

        teamTotalRisk.depression = Math.round(
            teams.reduce((sum, team) => sum + (team.depression?.risk_percent || 0), 0) / count
        );
    }

    const triggerByTrendType = {
        stress: severityTrends?.stress_trigger === true,
        anxiety: severityTrends?.anxiety_trigger === true,
        depression: severityTrends?.depression_trigger === true,
    };

    const hasRightRecommendationTrigger = triggerByTrendType[rightActiveType];

    const components = {
        stress: <StressContent teams={paginatedStress} />,
        anxiety: <AnxietyContent teams={paginatedAnxiety} />,
        depression: <DepressionContent teams={paginatedDepression} />,
    };

    const diagramComponents = {
        stress: <StressDiagram data={teamSeverityData?.stress} />,
        anxiety: <AnxietyDiagram data={teamSeverityData?.anxiety} />,
        depression: <DepressionDiagram data={teamSeverityData?.depression} />,
    };

    const chartComponents = {
        stress: <StressChart data={severityTrends?.stress || []} teamId={selectedTeamTabId} period={currentTeamPeriod} hasRightRecommendationTrigger={triggerByTrendType.stress} />,
        anxiety: <AnxietyChart data={severityTrends?.anxiety || []} teamId={selectedTeamTabId} period={currentTeamPeriod} hasRightRecommendationTrigger={triggerByTrendType.anxiety} />,
        depression: <DepressionChart data={severityTrends?.depression || []} teamId={selectedTeamTabId} period={currentTeamPeriod} hasRightRecommendationTrigger={triggerByTrendType.depression} />,
    };

    const triggerComponents = {
        stress: <DiagramStressTrigger />,
        anxiety: <DiagramAnxietyTrigger />,
        depression: <DiagramDepressionTrigger />,
    };

    const chartTriggerComponents = {
        stress: <ChartStressTrigger />,
        anxiety: <ChartAnxietyTrigger />,
        depression: <ChartDepressionTrigger />,
    };

    const selectedRiskTeam = teamRiskData?.teams?.[0];

    const teamRiskTriggers = {
        stress: selectedRiskTeam?.stress?.recommendation_trigger === true,
        anxiety: selectedRiskTeam?.anxiety?.recommendation_trigger === true,
        depression: selectedRiskTeam?.depression?.recommendation_trigger === true,
    };


    useEffect(() => {
        const loadTeams = async () => {
            try {
                const data = await fetchTeams();
                setTeams(data);

                if (data?.length > 0) {
                    setSelectedGeneralTeamIds([]);

                    const biggestTeam = data.reduce((max, item) => {
                        const maxCount =
                            max.team?.total_members ??
                            max.team?.members_count ??
                            max.team?.member_count ??
                            max.team?.members?.length ??
                            0;

                        const teamCount =
                            item.team?.total_members ??
                            item.team?.members_count ??
                            item.team?.member_count ??
                            item.team?.members?.length ??
                            0;

                        return teamCount > maxCount ? item : max;
                    }, data[0]);

                    setSelectedTeamTabId(biggestTeam.team.id);
                }
            } catch (error) {
                console.error("Ошибка при загрузке команд:", error);
            }
        };

        loadTeams();
    }, []);

    useEffect(() => {
        if (teams.length > 0 && !selectedTeamTabId) {
            const biggestTeam = teams.reduce((max, team) => {
                const maxCount =
                    max.total_members ??
                    max.members_count ??
                    max.member_count ??
                    max.members?.length ??
                    0;

                const teamCount =
                    team.total_members ??
                    team.members_count ??
                    team.member_count ??
                    team.members?.length ??
                    0;

                return teamCount > maxCount ? team : max;
            }, teams[0]);

            setSelectedTeamTabId(biggestTeam.id);
        }
    }, [teams, selectedTeamTabId]);

    useEffect(() => {
        const updateIndicatorSliders = () => {
            const leftActiveTab = indicatorTabsRef.current[activeType];
            const rightActiveTab = rightIndicatorTabsRef.current[rightActiveType];
            const employeeActiveTab = employeeTabsRef.current[employeeActiveType];
            const mainActiveTab = mainTabsRef.current[activeTab];

            if (leftActiveTab) {
                setIndicatorSliderStyle({
                    width: leftActiveTab.offsetWidth,
                    left: leftActiveTab.offsetLeft,
                    opacity: 1,
                });
            }

            if (rightActiveTab) {
                setRightIndicatorSliderStyle({
                    width: rightActiveTab.offsetWidth,
                    left: rightActiveTab.offsetLeft,
                    opacity: 1,
                });
            }

            if (employeeActiveTab) {
                setEmployeeSliderStyle({
                    width: employeeActiveTab.offsetWidth,
                    left: employeeActiveTab.offsetLeft,
                    opacity: 1,
                });
            }

            if (mainActiveTab) {
                setMainSliderStyle({
                    width: mainActiveTab.offsetWidth,
                    left: mainActiveTab.offsetLeft,
                    opacity: 1,
                });
            }
        };

        updateIndicatorSliders();
        window.addEventListener("resize", updateIndicatorSliders);

        return () => window.removeEventListener("resize", updateIndicatorSliders);
    }, [activeType, rightActiveType, employeeActiveType, activeTab]);

    const currentDiagramData = teamSeverityData?.[activeType] || [];

    const triggerByType = {
        stress: (teamSeverityData?.stress || []).some(
            (item) => item.recommendation_trigger === true
        ),
        anxiety: (teamSeverityData?.anxiety || []).some(
            (item) => item.recommendation_trigger === true
        ),
        depression: (teamSeverityData?.depression || []).some(
            (item) => item.recommendation_trigger === true
        ),
    };
    const hasRecommendationTrigger = triggerByType[activeType];

    const hasCountTestTrigger = testCountData?.recommendation_trigger === true;



    return (
        <div className="home-wrapper">
            <div className="home-container">
                <div className="tab-navigate">
                    <div
                        className={`main-tab ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => handleTabChange('general')}
                    >
    <span ref={(el) => (mainTabsRef.current['general'] = el)}>
        Общее
    </span>
                    </div>

                    <div
                        className={`main-tab ${activeTab === 'team' ? 'active' : ''}`}
                        onClick={() => handleTabChange('team')}
                    >
    <span ref={(el) => (mainTabsRef.current['team'] = el)}>
        Команда
    </span>
                    </div>

                    <div className="main-tab-track"></div>

                    <img
                        src={indicatorLine}
                        alt=""
                        className="main-tab-slider"
                        style={{
                            width: `${mainSliderStyle.width}px`,
                            transform: `translateX(${mainSliderStyle.left}px)`,
                            opacity: mainSliderStyle.opacity,
                        }}
                    />
                </div>
                {/* Содержимое вкладки "Общее" */}
                {activeTab === 'general' && (
                    <div>
                        <div className="main-header-content">
                            <div className="main-headleft-content">
                                <div className="select-count">
                                    <div className="select-content">
                                        <PeriodSelect
                                            value={generalPeriod}
                                            onChange={handleGeneralPeriodChange}
                                        />
                                        <CustomSelect
                                            options={teams}
                                            placeholder="Команды"
                                            selectedValues={selectedGeneralTeamIds}
                                            onChange={setSelectedGeneralTeamIds}
                                        />

                                    </div>
                                    <div className="count-test">
                                        <div className="text-count">
                                            <div className="main-text">
                                                Количество прохождений по всем командам:
                                                <span className="main-text-count">
                                                    {testCount?.teams?.reduce((sum, t) => sum + (t.current_count || 0), 0) ?? 0}
                                                </span>
                                            </div>
                                        </div>
                                        <img src={pychaHome} alt="Пуча" className="pucha-home"/>
                                    </div>
                                </div>
                                <div className="level-content">

                                    <div className="level-item1">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${generalP5}%` }} />
                                            <span className="shkala-text">{Math.round(generalP5)}%</span>
                                        </div>
                                        <img src={veryFunnySmile} alt="Смайл" className="very-funny-smile"/>
                                    </div>

                                    <div className="level-item2">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${generalP4}%` }} />
                                            <span className="shkala-text">{Math.round(generalP4)}%</span>
                                        </div>
                                        <img src={lightSmile} alt="Смайл" className="light-smile"/>
                                    </div>

                                    <div className="level-item3">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${generalP3}%` }} />
                                            <span className="shkala-text">{Math.round(generalP3)}%</span>
                                        </div>
                                        <img src={mediumSmile} alt="Смайл" className="moderate-smile"/>
                                    </div>

                                    <div className="level-item4">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${generalP2}%` }} />
                                            <span className="shkala-text">{Math.round(generalP2)}%</span>
                                        </div>
                                        <img src={sadSmile} alt="Смайл" className="sad-smile"/>
                                    </div>

                                    <div className="level-item5">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${generalP1}%` }} />
                                            <span className="shkala-text">{Math.round(generalP1)}%</span>
                                        </div>
                                        <img src={verySadSmile} alt="Смайл" className="very-sad-smile"/>
                                    </div>

                                </div>
                            </div>
                            <div className="main-hright-content">
                                <div className="metric-state">
                                    <div className="metric-card">
                                        <h1>Стресс</h1>
                                        <p>Зона риска <br />По всем командам</p>

                                        <div className="metric-shape">
                                            <div className="metric-shape-inner">
                                                <div
                                                    className="metric-liquid"
                                                    style={{ height: `${generalTotalRisk.stress}%` }}
                                                >
                                                    <svg
                                                        className="metric-wave"
                                                        viewBox="0 0 200 40"
                                                        preserveAspectRatio="none"
                                                    >
                                                        <path
                                                            d="
                                M0 20
                                Q25 0 50 20
                                T100 20
                                T150 20
                                T200 20
                                L200 40
                                L0 40
                                Z
                            "
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span>{generalTotalRisk.stress}%</span>
                                        </div>
                                    </div>

                                    <div className="metric-card">
                                        <h1>Тревога</h1>
                                        <p>Зона риска <br />По всем командам</p>

                                        <div className="metric-shape">
                                            <div className="metric-shape-inner">
                                                <div
                                                    className="metric-liquid"
                                                    style={{ height: `${generalTotalRisk.anxiety}%` }}
                                                >
                                                    <svg
                                                        className="metric-wave"
                                                        viewBox="0 0 200 40"
                                                        preserveAspectRatio="none"
                                                    >
                                                        <path
                                                            d="
                                M0 20
                                Q25 0 50 20
                                T100 20
                                T150 20
                                T200 20
                                L200 40
                                L0 40
                                Z
                            "
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span>{generalTotalRisk.anxiety}%</span>
                                        </div>
                                    </div>

                                    <div className="metric-card">
                                        <h1>Депрессия</h1>
                                        <p>Зона риска <br />По всем командам</p>

                                        <div className="metric-shape">
                                            <div className="metric-shape-inner">
                                                <div
                                                    className="metric-liquid"
                                                    style={{ height: `${generalTotalRisk.depression}%` }}
                                                >
                                                    <svg
                                                        className="metric-wave"
                                                        viewBox="0 0 200 40"
                                                        preserveAspectRatio="none"
                                                    >
                                                        <path
                                                            d="
                                M0 20
                                Q25 0 50 20
                                T100 20
                                T150 20
                                T200 20
                                L200 40
                                L0 40
                                Z
                            "
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span>{generalTotalRisk.depression}%</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="main-body-content">
                            <div className="percent-employee">
                                <div className="percent-employee-head">
                                    <div className="percent-employee-left">Процент сотрудников на каждом уровне риска</div>
                                    <div className="percent-employee-right">
                                        {Object.keys(components).map((type) => (
                                            <div
                                                key={type}
                                                className={`employee-tab ${employeeActiveType === type ? 'active' : ''}`}
                                                onClick={() => setEmployeeActiveType(type)}
                                            >
            <span
                ref={(el) => (employeeTabsRef.current[type] = el)}
                className="employee-button"
            >
                {type === 'stress'
                    ? 'Стресс'
                    : type === 'anxiety'
                        ? 'Тревога'
                        : 'Депрессия'}
            </span>
                                            </div>
                                        ))}

                                        <img
                                            src={indicatorLine}
                                            alt=""
                                            className="employee-slider"
                                            style={{
                                                width: `${employeeSliderStyle.width}px`,
                                                transform: `translateX(${employeeSliderStyle.left}px)`,
                                                opacity: employeeSliderStyle.opacity,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="percent-employee-content">
                                    {components[employeeActiveType]}
                                </div>
                                <div className="risk-pagination-wrapper">
                                    <Pagination
                                        currentPage={currentRiskPage}
                                        totalPages={totalRiskPages}
                                        onPageChange={setCurrentRiskPage}
                                    />
                                </div>
                            </div>
                            <div className="percent-testing">
                                <div className="percent-testing-head">Процент прохождения тестирования командами</div>
                                <div className="percent-testing-uphead">
                                    <div className="percent-testing-teams">Команды</div>
                                    <div className="percent-testing-number-team">
                                        <h1>Кол-во< br/> человек в команде</h1>
                                    </div>
                                    <div className="polosa"></div>
                                    <div className="percent-testing-number-test">
                                        <h1>Кол-во пройденных тестов за период</h1>
                                    </div>
                                    <div className="polosa"></div>
                                    <div className="percent-testing-percent-test">
                                        <h1>Процент прохождения тестирования</h1>
                                    </div>
                                </div>
                                <div className="12345">
                                    {paginatedTeams?.map((team, index) => (
                                        <div
                                            className={`percent-testing-row ${index === paginatedTeams.length - 1 ? 'last-row' : ''}`}
                                            key={team.team_id}
                                        >
                                            <div className="percent-testing-rowteam">
                                                <h1>{team.team_name}</h1>
                                            </div>
                                            <div className="percent-testing-number-rowteam">
                                                {team.total_members}
                                            </div>
                                            <div className="polosa"></div>
                                            <div className="percent-testing-number-rowtest">
                                                {team.completed_tests}
                                            </div>
                                            <div className="polosa"></div>
                                            <div className="percent-testing-percent-rowtest">
                                                <div className="progress-wrapper">
                                                    <div className="progress-bar-base">
                                                        <div
                                                            className="progress-bar-fill"
                                                            style={{ width: `${(89 * team.coverage_percent) / 100}px` }}
                                                        />
                                                    </div>
                                                    <span>{Math.round(team.coverage_percent)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="testing-pagination-wrapper">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil((coverageData?.teams?.length || 0) / rowsPerPage)}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Содержимое вкладки "Команда" */}
                {activeTab === 'team' && (
                    <div>
                        <div className="team-header-content">
                            <div className="team-headleft-content">
                                <div className="team-select-content">
                                    <TeamPeriodSelect
                                        value={teamPeriod}
                                        onChange={handleTeamPeriodChange}
                                    />
                                    <TeamCustomSelect
                                        options={teams}
                                        placeholder="Команды"
                                        value={selectedTeamTabId}
                                        onChange={(team) => setSelectedTeamTabId(team.id)}
                                    />

                                </div>
                                <div className="team-stress">
                                    <h1>Стресс</h1>
                                    <p>Зона риска</p>
                                    <div className="team-stress-sphere">
                                        <Sphera color={teamRiskTriggers.stress ? "#E34141" : "#9169EC"} />
                                        <span className="sphere-text">{teamTotalRisk.stress}%</span>
                                    </div>
                                </div>
                                <div className="team-anxiety">
                                    <h1>Тревога</h1>
                                    <p>Зона риска</p>
                                    <div className="team-anxiety-sphere">
                                        <Sphera color={teamRiskTriggers.anxiety ? "#E34141" : "#9169EC"} />
                                        <span className="sphere-text">{teamTotalRisk.anxiety}%</span>
                                    </div>
                                </div>
                                <div className="team-depression">
                                    <h1>Депрессия</h1>
                                    <p>Зона риска</p>
                                    <div className="team-depression-sphere">
                                        <Sphera color={teamRiskTriggers.depression ? "#E34141" : "#9169EC"} />
                                        <span className="sphere-text">{teamTotalRisk.depression}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="team-headright-content">
                                <div className="team-counter-test">
                                    <CountTest
                                        data={testCountData}
                                        hasRecommendationTrigger={hasCountTestTrigger}
                                        onTriggerClick={() =>
                                            setActiveTrigger(prev => (prev === "count-test" ? null : "count-test"))
                                        }
                                    />

                                    {activeTrigger === "count-test" && (
                                        <>
                                            <div
                                                className="overlay"
                                                onClick={() => setActiveTrigger(null)}
                                            />

                                            <CountTestTrigger />
                                        </>
                                    )}
                                </div>
                                <div className="team-moodscale-content">
                                    <TeamMoodscaleContent
                                        data={moodChartData}
                                        total={moodTotal}
                                        dynamicPoints={moodDynamicsData?.points || []}
                                        period={currentTeamPeriod}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="team-body-content">
                            <div className="team-left-block">
                                <div className={`team-left-indicator ${hasRecommendationTrigger ? "error" : ""}`}>
                                    <div className="header-left-indicator">
                                        <div className="indicator" style={{ position: "relative" }}>
                                            <div className={`indicator-text ${hasRecommendationTrigger ? "error" : ""}`}>
                                                Показатели
                                            </div>

                                            {hasRecommendationTrigger && (
                                                <>
                                                    <img
                                                        src={bigError}
                                                        alt="error-indicator"
                                                        className="indicator-icon"
                                                        onClick={() =>
                                                            setActiveTrigger(prev => (prev === activeType ? null : activeType))
                                                        }
                                                        style={{ cursor: "pointer" }}
                                                    />

                                                    {activeTrigger === activeType && (
                                                        <>
                                                            <div
                                                                className="overlay"
                                                                onClick={() => setActiveTrigger(null)}
                                                            />

                                                            {triggerComponents[activeTrigger]}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="indicator-metric">
                                            {Object.keys(diagramComponents).map((type) => (
                                                <div
                                                    key={type}
                                                    className={`
                                                    indicator-tab
                                                    ${activeType === type ? "active" : ""}
                                                    ${triggerByType[type] && activeType !== type ? "trigger-inactive" : ""}
                                                    ${triggerByType[type] && activeType === type ? "trigger-active" : ""}
                                                `}
                                                    onClick={() => setActiveType(type)}>
                                                <span
                                                    ref={(el) => (indicatorTabsRef.current[type] = el)}
                                                    className="indicator-button"
                                                >
                                                    {type === "stress"
                                                        ? "Стресс"
                                                        : type === "anxiety"
                                                            ? "Тревога"
                                                            : "Депрессия"}
                                                </span>
                                                </div>
                                            ))}

                                            <img
                                                src={indicatorLine}
                                                alt=""
                                                className={`indicator-slider ${hasRecommendationTrigger ? "error" : ""}`}
                                                style={{
                                                    width: `${indicatorSliderStyle.width}px`,
                                                    transform: `translateX(${indicatorSliderStyle.left}px)`,
                                                    opacity: indicatorSliderStyle.opacity,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="indicator-stroka"></div>
                                </div>

                                <div className="indicator-body">
                                    {diagramComponents[activeType]}
                                </div>
                            </div>

                            <div className="team-right-block">
                                <div className={`team-right-indicator ${hasRightRecommendationTrigger ? "error" : ""}`}>
                                    <div className="header-right-indicator">
                                        <div className="indicator" style={{ position: "relative" }}>
                                            <div className={`indicator-text ${hasRightRecommendationTrigger ? "error" : ""}`}>
                                                Показатели
                                            </div>

                                            {hasRightRecommendationTrigger && (
                                                <>
                                                    <img
                                                        src={bigError}
                                                        alt="error-indicator"
                                                        className="indicator-icon"
                                                        onClick={() =>
                                                            setActiveTrigger(prev => (prev === rightActiveType ? null : rightActiveType))
                                                        }
                                                        style={{ cursor: "pointer" }}
                                                    />

                                                    {activeTrigger === rightActiveType && (
                                                        <>
                                                            <div
                                                                className="overlay"
                                                                onClick={() => setActiveTrigger(null)}
                                                            />

                                                            {chartTriggerComponents[activeTrigger]}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <div className="right-indicator-metric">
                                            {Object.keys(chartComponents).map((type) => (
                                                <div
                                                    key={type}
                                                    className={`
                    indicator-tab
                    ${rightActiveType === type ? "active" : ""}
                    ${triggerByTrendType[type] && rightActiveType !== type ? "trigger-inactive" : ""}
                    ${triggerByTrendType[type] && rightActiveType === type ? "trigger-active" : ""}
                `}
                                                    onClick={() => setRightActiveType(type)}
                                                >
                <span
                    ref={(el) => (rightIndicatorTabsRef.current[type] = el)}
                    className="indicator-button"
                >
                    {type === "stress"
                        ? "Стресс"
                        : type === "anxiety"
                            ? "Тревога"
                            : "Депрессия"}
                </span>
                                                </div>
                                            ))}

                                            <img
                                                src={indicatorLine}
                                                alt=""
                                                className={`indicator-slider ${hasRightRecommendationTrigger ? "error" : ""}`}
                                                style={{
                                                    width: `${rightIndicatorSliderStyle.width}px`,
                                                    transform: `translateX(${rightIndicatorSliderStyle.left}px)`,
                                                    opacity: rightIndicatorSliderStyle.opacity,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="right-indicator-stroka"></div>
                                </div>
                                <div className="indicator-body">
                                    {chartComponents[rightActiveType]}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
