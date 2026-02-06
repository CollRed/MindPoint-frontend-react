import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './home.css';
import CustomSelect from "../../components/custom/custom-select.jsx";
import PeriodSelect from "../../components/custom/period-select.jsx";
import Pagination from "../../components/pagination/pagination.jsx";
import StressContent from "../../components/risk-widget/stress-content.jsx";
import AnxietyContent from "../../components/risk-widget/anxiety-content.jsx";
import DepressionContent from "../../components/risk-widget/depression-content.jsx";
import { authFetch } from "../../utils/authFetch.js";
import {
    fetchTeams,
} from "../../hooks/management.js";
import {
    useDassTestCountCommon,
    useRiskCategories,
    useTestingCoverage,
    useSeverityDistribution
} from "../../hooks/analytics-dass.js";
import pychaHome from "@assets/home-pucha.svg";

function HomePage() {
    const [activeTab, setActiveTab] = useState('general');
    const [activeType, setActiveType] = useState('stress');
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    const {
        severityData,
        loadingSeverityData,
        errorSeverityData
    } = useSeverityDistribution(selectedPeriod || 'week', []);



    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const {
        coverageData,
        loadingCoverage,
        errorCoverage
    } = useTestingCoverage(selectedPeriod || 'week', []);

    const totalPages = Math.ceil((coverageData?.teams?.length || 0) / rowsPerPage);

    const paginatedTeams = coverageData?.teams?.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    const [currentRiskPage, setCurrentRiskPage] = useState(1);
    const riskRowsPerPage = 11;

    const stressData = severityData?.stress || [];
    const paginatedStress = stressData.slice(
        (currentRiskPage - 1) * riskRowsPerPage,
        currentRiskPage * riskRowsPerPage
    );
    const totalRiskPages = Math.ceil(stressData.length / riskRowsPerPage)



    const {
        testCount,
        loadingTestCount,
        errorTestCount
    } = useDassTestCountCommon(selectedPeriod || 'week', selectedTeamId ? [selectedTeamId] : []);

    const {
        riskData,
        loadingRiskData,
        errorRiskData,
    } = useRiskCategories(selectedPeriod || 'week', selectedTeamId ? [selectedTeamId] : []);


    const totalRisk = {
        stress: 0,
        anxiety: 0,
        depression: 0,
    };

    const components = {
        stress: <StressContent teams={paginatedStress} />,
        anxiety: <AnxietyContent />,   // позже сделаем аналогично
        depression: <DepressionContent />
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
            } catch (error) {
                console.error("Ошибка при загрузке команд:", error);
            }
        };

        loadTeams();
    }, []);


    return (
        <div className="home-wrapper">
            <div className="home-container">
                <div className="tab-navigate">
                    <div className={`general-tab ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveTab('general')}
                    >
                        Общее
                    </div>
                    <div className={`team-tab ${activeTab === 'team' ? 'active' : ''}`}
                        onClick={() => setActiveTab('team')}
                    >
                        Команда
                    </div>
                </div>
                {/* Содержимое вкладки "Общее" */}
                {activeTab === 'general' && (
                    <div>
                        <div className="main-header-content">
                            <div className="main-headleft-content">
                                <div className="select-count">
                                    <div className="select-content">
                                        <PeriodSelect onChange={setSelectedPeriod} />
                                        <CustomSelect
                                            options={teams}
                                            placeholder="Команды"
                                            onChange={(team) => setSelectedTeamId(team.id)}
                                        />

                                    </div>
                                    <div className="count-test">
                                        <div className="text-count">
                                            <div className="main-text">
                                                Количество прохождений по всем командам:
                                                <span className="main-text-count">
                                                  {selectedTeamId
                                                      ? testCount?.teams?.[0]?.current_count ?? 0
                                                      : testCount?.teams?.reduce((sum, t) => sum + (t.current_count || 0), 0)}
                                                </span>
                                            </div>
                                        </div>
                                        <img src={pychaHome} alt="Пуча" className="pucha-home"/>
                                    </div>
                                </div>
                                <div className="level-content">
                                    <div className="level-item1"></div>
                                    <div className="level-item2"></div>
                                    <div className="level-item3"></div>
                                    <div className="level-item4"></div>
                                    <div className="level-item5"></div>
                                </div>
                            </div>
                            <div className="main-hright-content">
                                <div className="metric-state">
                                    <div className="metric-state">
                                        <div className="metric-stress">
                                            <h1>Стресс</h1>
                                            <p>Зона риска <br />По всем командам</p>
                                            <div className="stress-sphere">
                                                {totalRisk.stress}%
                                            </div>
                                        </div>
                                        <div className="metric-anxiety">
                                            <h1>Тревога</h1>
                                            <p>Зона риска <br />По всем командам</p>
                                            <div className="anxiety-sphere">
                                                {totalRisk.anxiety}%
                                            </div>
                                        </div>
                                        <div className="metric-depression">
                                            <h1>Депрессия</h1>
                                            <p>Зона риска <br />По всем командам</p>
                                            <div className="depression-sphere">
                                                {totalRisk.depression}%
                                            </div>
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
                                            <p
                                                key={type}
                                                className={`button-employee-${type}`}
                                                onClick={() => setActiveType(type)}
                                            >
                                                {type === 'stress' ? 'Стресс' : type === 'anxiety' ? 'Тревога' : 'Депрессия'}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                <div className="percent-employee-content">
                                    {components[activeType]}
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
                                <select className="team-period-select">
                                    <option disabled selected hidden>Период</option>
                                </select>
                                <select className="team-team-select">
                                    <option disabled selected hidden>Команды</option>
                                </select>
                                <div className="team-stress">
                                    <h1>Стресс</h1>
                                    <p>Зона риска</p>
                                    <div className="team-stress-sphere">Здесь будет сфера</div>
                                </div>
                                <div className="team-anxiety">
                                    <h1>Тревога</h1>
                                    <p>Зона риска</p>
                                    <div className="team-anxiety-sphere">Здесь будет сфера</div>
                                </div>
                                <div className="team-depression">
                                    <h1>Депрессия</h1>
                                    <p>Зона риска</p>
                                    <div className="team-depression-sphere">Здесь будет сфера</div>
                                </div>
                            </div>
                            <div className="team-headright-content">
                                <div className="team-counter-test">
                                    <h1 className="team-counter-text">Количество прохождений </h1>
                                    <div className="team-counter-number">100</div>
                                    <div className="team-counter-indicator">Здесь будут показатели</div>
                                </div>
                                <div className="team-moodscale-content">
                                    <div className="team-leftmoodscale-content">
                                        <h1 className="team-leftmoodscale-text">Шкала настроения</h1>
                                        <div className="team-leftmoodscale-diagram">Здесь будет Диаграмма</div>
                                        <div className="team-leftmoodscale-smile">Здесь будут Смайлы</div>
                                    </div>
                                    <div className="team-rightmoodscale-content">
                                        <h1 className="team-rightmoodscale-text">Динамика</h1>
                                        <div className="team-rightmoodscale-diagram">Здесь будет Диаграмма</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="team-body-content">
                            <div className="team-left-indicator"></div>
                            <div className="team-right-indicator"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
