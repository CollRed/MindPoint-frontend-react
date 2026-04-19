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
import sphera from "@assets/sphera.svg";
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
    const [selectedGeneralTeamId, setSelectedGeneralTeamId] = useState(null);
    const [selectedTeamTabId, setSelectedTeamTabId] = useState(null);

    const [selectedPeriod, setSelectedPeriod] = useState('week');

    const [activeTrigger, setActiveTrigger] = useState(null);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    const period = selectedPeriod || 'week';

    const { moodData, loadingMoodData } =
        useTeamsMoodDistribution(period, selectedTeamTabId ? [selectedTeamTabId] : []);

    const currentPoint =
        moodData?.points?.length
            ? moodData.points[moodData.points.length - 1]
            : null;

    const scores = currentPoint?.scores || {};

    const p1 = scores[1]?.percent || 0;
    const p2 = scores[2]?.percent || 0;
    const p3 = scores[3]?.percent || 0;
    const p4 = scores[4]?.percent || 0;
    const p5 = scores[5]?.percent || 0;

    const moodColors = ["#DDD6FE", "#CFC4FA", "#B9A7F6", "#9A77F0", "#8B5CF6"];

    const moodChartData = [1, 2, 3, 4, 5].map((score, index) => ({
        value: scores[score]?.percent || 0,
        count: scores[score]?.count || 0,
        color: moodColors[index],
    }));

    const moodTotal = currentPoint?.total_completions || 0;

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


    const generalSeverityTeamIds = selectedGeneralTeamId ? [selectedGeneralTeamId] : [];

    const {
        severityData: generalSeverityData,
        loadingSeverityData: loadingGeneralSeverityData,
        errorSeverityData: errorGeneralSeverityData
    } = useSeverityDistribution(period, generalSeverityTeamIds);

    const {
        severityData: teamSeverityData,
        loadingSeverityData: loadingTeamSeverityData,
        errorSeverityData: errorTeamSeverityData
    } = useSeverityDistribution(
        period,
        selectedTeamTabId ? [selectedTeamTabId] : []
    );

    const {
        severityTrends
    } = useSeverityTrends(period, selectedTeamTabId ? [selectedTeamTabId] : []);

    const {
        testCountData,
        loadingTestCountData,
        errorTestCountData,
    } = useDassTestCount(period, selectedTeamTabId);



    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const {
        coverageData,
        loadingCoverage,
        errorCoverage
    } = useTestingCoverage(period, selectedGeneralTeamId ? [selectedGeneralTeamId] : []);

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
    } = useTeamsMoodDynamics(period, selectedTeamTabId);



    const {
        testCount,
        loadingTestCount,
        errorTestCount
    } = useDassTestCountCommon(period, selectedGeneralTeamId ? [selectedGeneralTeamId] : []);

    const {
        riskData,
        loadingRiskData,
        errorRiskData,
    } = useRiskCategories(period, selectedGeneralTeamId ? [selectedGeneralTeamId] : []);


    const totalRisk = {
        stress: 0,
        anxiety: 0,
        depression: 0,
    };

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
        stress: <StressChart data={severityTrends?.stress || []} teamId={selectedTeamTabId} period={period}/>,
        anxiety: <AnxietyChart data={severityTrends?.anxiety || []} teamId={selectedTeamTabId} period={period} />,
        depression: <DepressionChart data={severityTrends?.depression || []} teamId={selectedTeamTabId} period={period} />,
    };

    const triggerComponents = {
        stress: <DiagramStressTrigger />,
        anxiety: <DiagramAnxietyTrigger />,
        depression: <DiagramDepressionTrigger />,
    };

    if (riskData?.teams?.length > 0) {
        const teams = riskData.teams;

        const count = teams.length;

        totalRisk.stress = Math.round(
            teams.reduce((sum, team) => sum + (team.stress?.risk_percent || 0), 0) / count
        );

        totalRisk.anxiety = Math.round(
            teams.reduce((sum, team) => sum + (team.anxiety?.risk_percent || 0), 0) / count
        );

        totalRisk.depression = Math.round(
            teams.reduce((sum, team) => sum + (team.depression?.risk_percent || 0), 0) / count
        );
    }

    useEffect(() => {
        const loadTeams = async () => {
            try {
                const data = await fetchTeams();
                setTeams(data);

                if (data?.length > 0) {
                    // для обычного селекта во вкладке "Общее"
                    setSelectedGeneralTeamId(data[0].id);

                    // для TeamCustomSelect — команда с максимальным числом участников
                    const biggestTeam = data.reduce((max, team) => {
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
                    }, data[0]);

                    setSelectedTeamTabId(biggestTeam.id);
                }
            } catch (error) {
                console.error("Ошибка при загрузке команд:", error);
            }
        };

        loadTeams();
    }, []);

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

    const hasRecommendationTrigger = currentDiagramData.some(
        (item) => item.recommendation_trigger === true
    );


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
                                            value={selectedPeriod}
                                            onChange={handlePeriodChange}
                                        />
                                        <CustomSelect
                                            options={teams}
                                            placeholder="Команды"
                                            value={selectedGeneralTeamId}
                                            onChange={(team) => setSelectedGeneralTeamId(team.id)}
                                        />

                                    </div>
                                    <div className="count-test">
                                        <div className="text-count">
                                            <div className="main-text">
                                                Количество прохождений по всем командам:
                                                <span className="main-text-count">
                                                  {selectedGeneralTeamId
                                                      ? testCount?.teams?.[0]?.current_count ?? 0
                                                      : testCount?.teams?.reduce((sum, t) => sum + (t.current_count || 0), 0)}
                                                </span>
                                            </div>
                                        </div>
                                        <img src={pychaHome} alt="Пуча" className="pucha-home"/>
                                    </div>
                                </div>
                                <div className="level-content">

                                    <div className="level-item1">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${p5}%` }} />
                                            <span className="shkala-text">{Math.round(p5)}%</span>
                                        </div>
                                        <img src={veryFunnySmile} alt="Смайл" className="very-funny-smile"/>
                                    </div>

                                    <div className="level-item2">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${p4}%` }} />
                                            <span className="shkala-text">{Math.round(p4)}%</span>
                                        </div>
                                        <img src={lightSmile} alt="Смайл" className="light-smile"/>
                                    </div>

                                    <div className="level-item3">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${p3}%` }} />
                                            <span className="shkala-text">{Math.round(p3)}%</span>
                                        </div>
                                        <img src={mediumSmile} alt="Смайл" className="moderate-smile"/>
                                    </div>

                                    <div className="level-item4">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${p2}%` }} />
                                            <span className="shkala-text">{Math.round(p2)}%</span>
                                        </div>
                                        <img src={sadSmile} alt="Смайл" className="sad-smile"/>
                                    </div>

                                    <div className="level-item5">
                                        <div className="shkala">
                                            <div className="shkala-fill" style={{ width: `${p1}%` }} />
                                            <span className="shkala-text">{Math.round(p1)}%</span>
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
                                                    style={{ height: `${totalRisk.stress}%` }}
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
                                            <span>{totalRisk.stress}%</span>
                                        </div>
                                    </div>

                                    <div className="metric-card">
                                        <h1>Тревога</h1>
                                        <p>Зона риска <br />По всем командам</p>

                                        <div className="metric-shape">
                                            <div className="metric-shape-inner">
                                                <div
                                                    className="metric-liquid"
                                                    style={{ height: `${totalRisk.anxiety}%` }}
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
                                            <span>{totalRisk.anxiety}%</span>
                                        </div>
                                    </div>

                                    <div className="metric-card">
                                        <h1>Депрессия</h1>
                                        <p>Зона риска <br />По всем командам</p>

                                        <div className="metric-shape">
                                            <div className="metric-shape-inner">
                                                <div
                                                    className="metric-liquid"
                                                    style={{ height: `${totalRisk.depression}%` }}
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
                                            <span>{totalRisk.depression}%</span>
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
                                <Pagination
                                    currentPage={currentRiskPage}
                                    totalPages={totalRiskPages}
                                    onPageChange={setCurrentRiskPage}
                                />
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
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil((coverageData?.teams?.length || 0) / rowsPerPage)}
                                    onPageChange={setCurrentPage}
                                />
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
                                        value={selectedPeriod}
                                        onChange={handlePeriodChange}
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
                                        <img src={sphera} alt="sphere" className="sphera"/>
                                        <span className="sphere-text">{totalRisk.stress}%</span>
                                    </div>
                                </div>
                                <div className="team-anxiety">
                                    <h1>Тревога</h1>
                                    <p>Зона риска</p>
                                    <div className="team-anxiety-sphere">
                                        <img src={sphera} alt="sphere" className="sphera"/>
                                        <span className="sphere-text">{totalRisk.anxiety}%</span>
                                    </div>
                                </div>
                                <div className="team-depression">
                                    <h1>Депрессия</h1>
                                    <p>Зона риска</p>
                                    <div className="team-depression-sphere">
                                        <img src={sphera} alt="sphere" className="sphera"/>
                                        <span className="sphere-text">{totalRisk.depression}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="team-headright-content">
                                <div className="team-counter-test">
                                    <CountTest data={testCountData} />
                                </div>
                                <div className="team-moodscale-content">
                                    <TeamMoodscaleContent
                                        data={moodChartData}
                                        total={moodTotal}
                                        dynamicPoints={moodDynamicsData?.points || []}
                                        period={period}
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

                                                    {activeTrigger && (
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
                                                    className={`indicator-tab ${activeType === type ? "active" : ""}`}
                                                    onClick={() => setActiveType(type)}
                                                >
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
                                                className="indicator-slider"
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
                                <div className="team-right-indicator">
                                    <div className="header-right-indicator">
                                        <div className="right-indicator">Показатели</div>
                                        <div className="right-indicator-metric">
                                            {Object.keys(chartComponents).map((type) => (
                                                <div
                                                    key={type}
                                                    className={`indicator-tab ${rightActiveType === type ? "active" : ""}`}
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
                                                className="indicator-slider"
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
