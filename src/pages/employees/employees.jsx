import { useState, useEffect, useMemo } from "react";
import {
    useEmployees,
    useManagerRequests,
    useTeams,
    fetchEmployees,
    fetchManagerRequests,
    fetchTeams,
    handleRespond,
    handleAssignEmployee,
    handleDeleteEmployee,
    handleCreateTeam,
    getTeamMembers,
    handleAssignTeamLead,
    handleMoveMember,
    handleRemoveMemberFromTeam,
    handleDeleteTeam,
    handleRevokeTeamLead,
} from "../../hooks/management.js";
import './employees.css';
import Pagination from "../../components/pagination/pagination.jsx";
import Notification from "../../components/notification/notification.jsx";
import CreateTeamModal from "../../components/modals/create-team-modal.jsx";
import TeamModal from "../../components/modals/team-modal.jsx";
import EmployeeModal from "../../components/modals/employee-modal.jsx";
import TeamLeadModal from "../../components/modals/teamlead-modal.jsx";
import pychaImage from "@assets/smart-pycha.svg";
import searchIcon from "@assets/search.svg";
import cloudPlace from "@assets/cloud-place.svg";
import approveIcon from "@assets/approve.svg";
import cancelIcon from "@assets/cancel.svg";
import questionIcon from "@assets/question.svg";
import inviteIcon from "@assets/invite-team.svg"
import deleteIcon from "@assets/delete-employee.svg"
import infoIcon from "@assets/info.svg";
import plusIcon from "@assets/plus-icon.svg"
import downIcon from "@assets/down-icon.svg"

export default function EmployeesPage() {
    const { employees, setEmployees, loadingEmployees, errorEmployees } = useEmployees();
    const { managerRequests, setManagerRequests, loadingRequests, errorRequests } = useManagerRequests();
    const { teams, setTeams } = useTeams();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("Список команд");
    const filterOptions = [
        "Список команд",
        "Добавление в компанию",
        "Сотрудники без команды",
        "Все виджеты"
    ];
    const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);

    const [activeEmployee, setActiveEmployee] = useState(null);
    const [assignToTeamId, setAssignToTeamId] = useState("");
    const [removeFromTeamId, setRemoveFromTeamId] = useState("");

    const [isTeamLeadModalOpen, setIsTeamLeadModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [activeTeamModal, setActiveTeamModal] = useState(null);
    const [selectedLeadId, setSelectedLeadId] = useState("");
    const [moveUserId, setMoveUserId] = useState("");
    const [moveToTeamId, setMoveToTeamId] = useState("");
    const [removeUserId, setRemoveUserId] = useState("");

    const initialConfirmModalState = {
        isOpen: false,
        type: null,
        requestId: null,
        isApproved: null,
        employeeName: "",
        teamId: "",
        teamName: "",
    };
    const [confirmModal, setConfirmModal] = useState(initialConfirmModalState);

    const [notifications, setNotifications] = useState([]);
    const addNotification = (type, message) => {
        setNotifications((prev) => [
            ...prev,
            { id: Date.now(), type, message },
        ]);
    };

    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");
    const [isCreateConfirmOpen, setIsCreateConfirmOpen] = useState(false);

    // 🔁 Сотрудники без команды
    const employeesWithoutTeam = useMemo(() => {
        return employees.filter(e => {
            const hasNoTeams = !Array.isArray(e.teams) || e.teams.length === 0;
            return hasNoTeams;
        });
    }, [employees]);

    // 🔁 Отфильтрованные команды
    const [expandedTeams, setExpandedTeams] = useState({});
    const [openTeamIds, setOpenTeamIds] = useState(() => {
        try {
            const saved = localStorage.getItem("openTeamIds");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const filteredTeams = useMemo(() => {
        if (!searchTerm) return teams;

        return teams.map(teamData => {
            const teamId = teamData.team.id;
            const members = expandedTeams[teamId] || [];

            const matchedMembers = members.filter(member =>
                member.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return {
                ...teamData,
                members: matchedMembers,
                membersCount: matchedMembers.length, // 👈 пересчёт
            };
        }).filter(teamData => teamData.members.length > 0); // ❗ исключаем команды без совпадений
    }, [teams, expandedTeams, searchTerm]);


    // 🔍 Фильтрация видимых данных
    const visibleRequests = useMemo(() => {
        if (filterOption === "Добавление в компанию" || filterOption === "Все виджеты") {
            if (!searchTerm) return managerRequests;

            return managerRequests.filter(req =>
                req.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return managerRequests;
    }, [managerRequests, searchTerm, filterOption]);


    const visibleEmployees = useMemo(() => {
        if (filterOption === "Сотрудники без команды" || filterOption === "Все виджеты") {
            if (!searchTerm) return employeesWithoutTeam;

            return employeesWithoutTeam.filter(e =>
                e.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // ❗ возвращаем весь список без фильтрации
        return employeesWithoutTeam;
    }, [employeesWithoutTeam, searchTerm, filterOption]);


    const visibleTeams = useMemo(() => {
        if (filterOption === "Список команд" || filterOption === "Все виджеты") {
            return filteredTeams; // уже внутри фильтруется по searchTerm
        }

        return teams;
    }, [teams, filteredTeams, filterOption]);


    // 🔢 Пагинация для заявок
    const itemsPerPageRequests = 5;
    const [currentPageRequests, setCurrentPageRequests] = useState(1);
    const totalPagesRequests = Math.ceil(visibleRequests.length / itemsPerPageRequests);
    const paginatedRequests = visibleRequests.slice(
        (currentPageRequests - 1) * itemsPerPageRequests,
        currentPageRequests * itemsPerPageRequests
    );
    useEffect(() => {
        if (currentPageRequests > totalPagesRequests && totalPagesRequests > 0) {
            setCurrentPageRequests(totalPagesRequests);
        }
    }, [currentPageRequests, totalPagesRequests]);

    // 🔢 Пагинация для сотрудников
    const itemsPerPageEmployees = 5;
    const [currentPageEmployees, setCurrentPageEmployees] = useState(1);
    const totalPagesEmployees = Math.ceil(visibleEmployees.length / itemsPerPageEmployees);
    const paginatedEmployees = visibleEmployees.slice(
        (currentPageEmployees - 1) * itemsPerPageEmployees,
        currentPageEmployees * itemsPerPageEmployees
    );
    useEffect(() => {
        if (currentPageEmployees > totalPagesEmployees && totalPagesEmployees > 0) {
            setCurrentPageEmployees(totalPagesEmployees);
        }
    }, [currentPageEmployees, totalPagesEmployees]);

    // 🔢 Пагинация для команд
    const itemsPerPageTeams = 13;
    const [currentPageTeams, setCurrentPageTeams] = useState(1);
    function paginateTeamsRowByRow(teams, expandedTeams, openTeamIds, itemsPerPage) {
        const pages = [];
        let currentPage = [];
        let currentRowCount = 0;

        for (const teamData of teams) {
            if (!teamData?.team?.id) continue;

            const teamId = teamData.team.id;
            const members = teamData.members ?? [];
            const sortedMembers = [...members].sort((a, b) => Number(b.is_teamlead) - Number(a.is_teamlead));

            // 🟣 Добавляем строку команды
            if (currentRowCount >= itemsPerPage) {
                pages.push(currentPage);
                currentPage = [];
                currentRowCount = 0;
            }

            const teamRow = {
                type: "team",
                team: teamData.team,
                membersCount: sortedMembers.length,
                members: sortedMembers,
            };

            currentPage.push(teamRow);
            currentRowCount += 1;

            // 🔵 Добавляем участников (если команда раскрыта)
            if (openTeamIds.includes(teamId)) {
                for (const member of sortedMembers) {
                    if (currentRowCount >= itemsPerPage) {
                        // Перед переходом на новую страницу — удостоверимся, что команда уже отрендерена
                        const alreadyHasTeam = currentPage.some(
                            (row) => row.type === "team" && row.team.id === teamId
                        );
                        if (!alreadyHasTeam) {
                            // не добавляем участника без команды
                            continue;
                        }

                        pages.push(currentPage);
                        currentPage = [];
                        currentRowCount = 0;
                    }

                    currentPage.push({
                        type: "member",
                        member,
                        teamId,
                    });

                    currentRowCount += 1;
                }
            }
        }

        if (currentPage.length > 0) {
            pages.push(currentPage);
        }

        return pages;
    }



    const [ready, setReady] = useState(false);


    const teamPages = useMemo(() => {
        if (!ready || Object.keys(expandedTeams).length === 0) return [];
        return paginateTeamsRowByRow(visibleTeams, expandedTeams, openTeamIds, itemsPerPageTeams);
    }, [visibleTeams, expandedTeams, openTeamIds, ready]);


    const totalPagesTeams = teamPages.length;
    const paginatedTeams = teamPages[currentPageTeams - 1] || [];
    useEffect(() => {
        if (currentPageTeams > totalPagesTeams && totalPagesTeams > 0) {
            setCurrentPageTeams(totalPagesTeams);
        }
    }, [currentPageTeams, totalPagesTeams]);

    // 🔹 Обработка действий
    const onRespond = (requestId, isApproved) => {
        handleRespond(requestId, isApproved, setManagerRequests);
    };

    const onAssignEmployee = (employeeId, teamId, employeeName) => {
        handleAssignEmployee(employeeId, teamId, employeeName);
    };




useEffect(() => {
        if (currentPageTeams > totalPagesTeams && totalPagesTeams > 0) {
            setCurrentPageTeams(totalPagesTeams);
        }
    }, [totalPagesTeams, currentPageTeams]);


    useEffect(() => {
        async function preloadAllTeamMembers() {
            const expanded = {};

            for (const teamData of teams) {
                if (!teamData?.team?.id) continue;
                const teamId = teamData.team.id;

                try {
                    const response = await getTeamMembers(teamId);

                    const members = response?.members || [];
                    const teamLeads = response?.team_leads || [];

                    expanded[teamId] = [...members, ...teamLeads]; // 👈 объединение здесь

                } catch (err) {
                    console.error(`Ошибка загрузки участников команды ${teamId}:`, err);
                }
            }

            setExpandedTeams(expanded);
        }

        if (teams.length > 0) {
            preloadAllTeamMembers();
        }
    }, [teams]);


// 🔹 toggleTeam нужно оставить отдельно
    const toggleTeam = (teamId) => {
        const isOpen = openTeamIds.includes(teamId);

        if (isOpen) {
            // Закрываем
            setOpenTeamIds(prev => prev.filter(id => id !== teamId));
        } else {
            // Открываем
            setOpenTeamIds(prev => [...prev, teamId]);
        }
    };

    useEffect(() => {
        localStorage.setItem("openTeamIds", JSON.stringify(openTeamIds));
    }, [openTeamIds]);


    useEffect(() => {
        const teamsLoaded = teams.length > 0 || !loadingRequests;

        const expandedReady =
            teamsLoaded &&
            Object.keys(expandedTeams).length === teams.length;

        if (teamsLoaded && expandedReady) {
            setReady(true);
        }
    }, [teams, expandedTeams, loadingRequests]);






    // 🔹 Модалки
    const openConfirmModal = (type, extra = {}) => {
        setConfirmModal({ isOpen: true, type, ...extra });
    };

    const handleOpenCreateTeamForm = () => {
        setIsCreateTeamOpen(true);
    };

    const handleConfirm = async () => {
        switch (confirmModal.type) {
            case "approve":
            case "reject":
                handleRespond(confirmModal.requestId, confirmModal.isApproved, async () => {
                    addNotification("success", "Успешно");
                    await refreshAllData();
                    setConfirmModal(initialConfirmModalState);
                });
                return;

            case "delete":
                handleDeleteEmployee(
                    confirmModal.employeeId,
                    confirmModal.employeeName,
                    async () => {
                        addNotification("success", "Успешно");
                        await refreshAllData();
                        setConfirmModal(initialConfirmModalState);
                    }
                );
                return;

            case "assign":
                if (!confirmModal.teamName) {
                    addNotification("error", "Ошибка");
                    return;
                }

                // Переход на подтверждение
                setConfirmModal(prev => ({
                    ...prev,
                    type: "assignConfirm",
                }));
                return;

            case "assignConfirm":
                handleAssignEmployee(
                    confirmModal.employeeId,
                    confirmModal.teamId,
                    confirmModal.employeeName,
                    async () => {
                        addNotification("success", "Успешно");
                        await refreshAllData();
                        setConfirmModal(initialConfirmModalState);
                    }
                );
                return;

            default:
                break;
        }

        // На всякий случай — закрываем модалку
        setConfirmModal(initialConfirmModalState);
    };

    const handleCancel = () => {
        setConfirmModal(initialConfirmModalState);
    };

    const refreshAllData = async () => {
        try {
            // 1️⃣ Загружаем новые данные
            const [newTeams, newEmployees, newRequests] = await Promise.all([
                fetchTeams(),
                fetchEmployees(),
                fetchManagerRequests(),
            ]);

            // 2️⃣ Обновляем списки
            setTeams(newTeams);
            setEmployees(newEmployees);
            setManagerRequests(newRequests);

            // 3️⃣ Обновляем раскрытые команды, но НЕ закрываем их
            const updatedExpandedTeams = {};

            for (const team of newTeams) {
                const teamId = team.team.id;
                try {
                    const response = await getTeamMembers(teamId);
                    const members = response?.members || [];
                    const teamLeads = response?.team_leads || [];

                    updatedExpandedTeams[teamId] = [...members, ...teamLeads];
                } catch (err) {
                    console.error(`Ошибка загрузки участников команды ${teamId}:`, err);
                }
            }


            // 4️⃣ Обновляем expandedTeams, но не схлопываем
            setExpandedTeams(updatedExpandedTeams);

        } catch (err) {
            console.error("Ошибка при обновлении данных:", err);
        }
    };



    return (
        <div className="employees-bg">
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <img
                        src={searchIcon}
                        alt="Лупа"
                        className="search-icon"
                    />
                    <input
                        type="text"
                        placeholder="Поиск"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div
                    className="filter-select"
                    onClick={() => setFilterDropdownOpen(!isFilterDropdownOpen)}
                >
                    {filterOption}
                </div>

                {isFilterDropdownOpen && (
                    <div className="filter-dropdown">
                        {filterOptions.map(option => (
                            <div
                                key={option}
                                className="filter-option"
                                onClick={() => {
                                    setFilterOption(option);
                                    setFilterDropdownOpen(false);
                                }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <div className="team-page-content">
                <div className="left-team-content">
                    <div className="team-list">
                        <div className="team-header-table">
                            <div className="team-header-item">
                                <h2 className="team-table-title">Списки команд</h2>
                                <img
                                    src={plusIcon}
                                    alt="Добавить команду"
                                    className="plus-icon"
                                    onClick={handleOpenCreateTeamForm}
                                />
                            </div>
                            <Pagination
                                currentPage={currentPageTeams}
                                totalPages={totalPagesTeams}
                                onPageChange={setCurrentPageTeams}
                            />
                        </div>

                        <div className="team-table">
                            {paginatedTeams.length > 0 && (
                                <div className="team-table-head">
                                    <span className="name-team-header">Название команды</span>
                                    <span className="amount-team-header">Кол-во</span>
                                    <span className="member-team-header">Роль</span>
                                </div>
                            )}
                        </div>

                        <div className="team-table-body">
                            {!ready ? (
                                <div className="loading">Загрузка...</div>
                            ) : paginatedTeams.length === 0 ? (
                                <div className="empty-team-placeholder">
                                    <div className="right-team-placeholder">
                                        <img src={cloudPlace} alt="Пусто" className="placeholder-icon" />
                                    </div>
                                    <div className="left-team-placeholder">
                                        <p className="placeholder-title">Здесь пока пусто</p>
                                        <p className="placeholder-subtitle">Создайте свою первую команду</p>
                                    </div>
                                </div>
                            ) : (
                                paginatedTeams.map((row, index) =>
                                        row.type === "team" ? (
                                            <div key={`team-${row.team.id}`}>
                                                <div
                                                    className={`team-table-row ${
                                                        index === paginatedTeams.length - 1 &&
                                                        currentPageTeams === totalPagesTeams
                                                            ? "last-row"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="team-name">
                                                        <img
                                                            src={downIcon}
                                                            alt="Открыть"
                                                            className={`down-icon ${
                                                                openTeamIds.includes(row.team.id) ? "rotated" : ""
                                                            } ${
                                                                (row.members || []).length === 0 ? "disabled" : ""
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                (row.members || []).length > 0 &&
                                                                toggleTeam(row.team.id);
                                                            }}
                                                        />
                                                        <span
                                                            className="team-name-text"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveTeamModal({
                                                                    teamId: row.team.id,
                                                                    teamName: row.team.name,
                                                                    members: row.members || [],
                                                                });
                                                            }}
                                                        >
                                    {row.team.name}
                                </span>
                                                    </div>
                                                    <div className="team-count">{row.membersCount}</div>
                                                    <div className="team-edit">Ред.</div>
                                                </div>

                                                {openTeamIds.includes(row.team.id) && (
                                                    <div className="team-members-wrapper open"></div>
                                                )}
                                            </div>
                                        ) : row.type === "member" && openTeamIds.includes(row.teamId) ? (
                                            <div
                                                key={`member-${row.teamId}-${row.member.id}`}
                                                className={`team-member-row ${
                                                    index === paginatedTeams.length - 1 &&
                                                    currentPageTeams === totalPagesTeams
                                                        ? "last-row"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    const employeeTeams = teams
                                                        .filter((t) =>
                                                            (expandedTeams[t.team.id] || []).some(
                                                                (m) => m.id === row.member.id
                                                            )
                                                        )
                                                        .map((t) => ({
                                                            id: t.team.id,
                                                            name: t.team.name,
                                                        }));

                                                    if (row.member.is_teamlead) {
                                                        setSelectedEmployee({
                                                            ...row.member,
                                                            teams: employeeTeams,
                                                            currentTeamId: row.teamId,
                                                            currentTeamName:
                                                                teams.find((t) => t.team.id === row.teamId)
                                                                    ?.team?.name || "",
                                                        });
                                                        setIsTeamLeadModalOpen(true);
                                                    } else {
                                                        setActiveEmployee({
                                                            ...row.member,
                                                            teams: employeeTeams,
                                                            currentTeamId: row.teamId,
                                                            currentTeamName:
                                                                teams.find((t) => t.team.id === row.teamId)
                                                                    ?.team?.name || "",
                                                        });
                                                    }
                                                }}
                                            >
                        <span className="team-employee-name">
                            {row.member.fullname}
                        </span>
                                                <span className="member-role">
                            {row.member.is_teamlead ? "Тимлид" : "Сотрудник"}
                        </span>
                                            </div>
                                        ) : null
                                )
                            )}
                        </div>
                    </div>


                </div>
                <div className="right-team-content">
                    {/* 🔹 Запросы */}
                    <div className="request-team-list">
                        <div className="header-table">
                            <h2 className="table-title">Запросы на добавление в компанию</h2>
                            <Pagination
                                currentPage={currentPageRequests}
                                totalPages={totalPagesRequests}
                                onPageChange={setCurrentPageRequests}
                            />
                        </div>

                        <div className="requests-table">
                            {paginatedRequests.length > 0 && (
                            <div className="table-head">
                                <span>Дата запроса</span>
                                <span>ФИО</span>
                            </div>
                            )}
                            <div className="table-body">
                                {loadingRequests ? (
                                    <div className="loading">Загрузка...</div>
                                ) : errorRequests ? (
                                    <div className="error">{errorRequests}</div>
                                ) : paginatedRequests.length === 0 ? (
                                    <div className="empty-requests-placeholder">
                                        <div className="right-requests-placeholder">
                                            <img src={cloudPlace} alt="Пусто" className="placeholder-icon" />
                                        </div>
                                        <div className="left-requests-placeholder">
                                            <p className="placeholder-title-requests">Нет новых запросов</p>
                                            <p className="placeholder-subtitle-requests">
                                                Все запросы на присоединение
                                                к компании обработаны
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    paginatedRequests.map((req) => (
                                        <div key={req.request_id} className="table-row">
                                            <div className="table-date">
                                                {req.created_at
                                                    ? new Date(req.created_at).toLocaleDateString('ru-RU')
                                                    : "--.--.----"}
                                            </div>
                                            <div className="table-name">{req.full_name || "—"}</div>
                                            <div className="table-actions">
                                                <img
                                                    src={approveIcon}
                                                    alt="Принять"
                                                    className="action-approve"
                                                    onClick={() =>
                                                        openConfirmModal("approve", {
                                                            requestId: req.request_id,
                                                            isApproved: true,
                                                        })
                                                    }
                                                />
                                                <img
                                                    src={cancelIcon}
                                                    alt="Отклонить"
                                                    className="action-cancel"
                                                    onClick={() =>
                                                        openConfirmModal("reject", {
                                                            requestId: req.request_id,
                                                            isApproved: false,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 🔹 Сотрудники без команд */}
                    <div className="employee-team-list">
                        <div className="employee-header-table">
                            <h2 className="employee-table-title">Сотрудники без команд</h2>
                            <Pagination
                                currentPage={currentPageEmployees}
                                totalPages={totalPagesEmployees}
                                onPageChange={setCurrentPageEmployees}
                            />
                        </div>

                        <div className="employee-requests-table">
                            {paginatedEmployees.length > 0 && (
                                <div className="employee-table-head">
                                    <div className="head-left-modal">
                                        <span>ФИО</span>
                                    </div>

                                    <div className="head-right-modal">
                                        <span className="invite-team">Назначить команду</span>
                                        <span>/</span>
                                        <span className="delete">Удалить</span>
                                    </div>
                                </div>
                            )}

                            <div className="employee-table-body">
                                {loadingEmployees ? (
                                    <div className="loading">Загрузка...</div>
                                ) : errorEmployees ? (
                                    <div className="error">{errorEmployees}</div>
                                ) : paginatedEmployees.length === 0 ? (
                                    <div className="empty-list-placeholder">
                                        <div className="right-list-placeholder">
                                            <img src={cloudPlace} alt="Пусто" className="placeholder-icon" />
                                        </div>
                                        <div className="left-list-placeholder">
                                            <p className="placeholder-title-list">Все на своих местах</p>
                                            <p className="placeholder-subtitle-list">
                                                Каждый сотрудник назначен в команду
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    paginatedEmployees.map((employee) => (
                                        <div key={employee.id} className="employee-table-row">
                                            <div className="name-employee">{employee.fullname || "—"}</div>
                                            <div className="right-actions">
                                                <img
                                                    src={inviteIcon}
                                                    alt="Назначить команду"
                                                    className="invite-team-icon"
                                                    onClick={() =>
                                                        openConfirmModal("assign", {
                                                            employeeId: employee.id,          // вот он, ID с бэка
                                                            employeeName: employee.fullname,  // имя для отображения
                                                        })
                                                    }
                                                />
                                                <img
                                                    src={deleteIcon}
                                                    alt="Удалить сотрудника"
                                                    className="delete-employee-icon"
                                                    onClick={() =>
                                                        openConfirmModal("delete", {
                                                            employeeId: employee.id,
                                                            employeeName: employee.fullname,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="smart-pycha">
                    <img
                        src={pychaImage}
                        alt="Добавить команду"
                    />
                </div>
            </div>

            {confirmModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-icon">
                            <img
                                src={confirmModal.type === "assign" ? infoIcon : questionIcon}
                                alt="Иконка"
                            />
                        </div>

                        {/* Текст внутри модалки */}
                        {confirmModal.type === "approve" && (
                            <p className="modal-text">Вы уверены, что хотите принять запрос?</p>
                        )}

                        {confirmModal.type === "reject" && (
                            <p className="modal-text">Вы уверены, что хотите отклонить запрос?</p>
                        )}

                        {confirmModal.type === "delete" && (
                            <p className="modal-text">
                                Вы уверены, что хотите удалить сотрудника{" "}
                                <b>{confirmModal.employeeName}</b> из компании?
                            </p>
                        )}

                        {confirmModal.type === "assign" && (
                            <>
                                <p className="modal-text">Назначить сотрудника в команду</p>
                                <p className="modal-subtext">
                                    ФИО Сотрудника: <b>{confirmModal.employeeName}</b>
                                </p>

                                <select
                                    className="modal-select"
                                    value={confirmModal.teamId || ""}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        const selectedTeam = teams.find((teamData) => teamData.team.id === selectedId)?.team;

                                        setConfirmModal((prev) => ({
                                            ...prev,
                                            teamId: selectedId,
                                            teamName: selectedTeam?.name || "",
                                        }));
                                    }}
                                >
                                    <option value="" disabled hidden>Выберите команду</option>
                                    {teams.map((teamData) => (
                                        <option key={teamData.team.id} value={teamData.team.id}>
                                            {teamData.team.name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        {confirmModal.type === "assignConfirm" && (
                            <p className="modal-text">
                                Вы уверены, что хотите назначить сотрудника{" "}
                                <b>{confirmModal.employeeName}</b> в команду{" "}
                                <b>{confirmModal.teamName}</b>?
                            </p>
                        )}

                        <div className="modal-buttons">
                            <button className="btn-yes" onClick={handleConfirm}>
                                Да
                            </button>
                            <button className="btn-no" onClick={handleCancel}>
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCreateTeamOpen && (
                <CreateTeamModal
                    isCreateTeamOpen={isCreateTeamOpen}
                    isCreateConfirmOpen={isCreateConfirmOpen}
                    newTeamName={newTeamName}
                    setNewTeamName={setNewTeamName}
                    setIsCreateTeamOpen={setIsCreateTeamOpen}
                    setIsCreateConfirmOpen={setIsCreateConfirmOpen}
                    addNotification={addNotification}
                    handleCreateTeam={handleCreateTeam}
                    refreshAllData={refreshAllData}
                />
            )}

            {activeTeamModal && (
                <TeamModal
                    activeTeamModal={activeTeamModal}
                    setActiveTeamModal={setActiveTeamModal}
                    selectedLeadId={selectedLeadId}
                    setSelectedLeadId={setSelectedLeadId}
                    moveUserId={moveUserId}
                    setMoveUserId={setMoveUserId}
                    moveToTeamId={moveToTeamId}
                    setMoveToTeamId={setMoveToTeamId}
                    removeUserId={removeUserId}
                    setRemoveUserId={setRemoveUserId}
                    teams={teams}
                    handleAssignTeamLead={handleAssignTeamLead}
                    handleMoveMember={handleMoveMember}
                    handleRemoveMemberFromTeam={handleRemoveMemberFromTeam}
                    handleDeleteTeam={handleDeleteTeam}
                    refreshAllData={refreshAllData}
                    addNotification={addNotification}
                />
            )}
            {activeEmployee && (
                <EmployeeModal
                    activeEmployee={activeEmployee}
                    setActiveEmployee={setActiveEmployee}

                    teams={teams}
                    addNotification={addNotification}
                    refreshAllData={refreshAllData}

                    assignToTeamId={assignToTeamId}
                    setAssignToTeamId={setAssignToTeamId}

                    moveToTeamId={moveToTeamId}
                    setMoveToTeamId={setMoveToTeamId}

                    removeFromTeamId={removeFromTeamId}
                    setRemoveFromTeamId={setRemoveFromTeamId}

                    handleAssignEmployee={handleAssignEmployee}
                    handleMoveMember={handleMoveMember}
                    handleRemoveMemberFromTeam={handleRemoveMemberFromTeam}

                    handleAssignTeamLead={handleAssignTeamLead}   // 🔥 вот это новое
                />
            )}
            <TeamLeadModal
                isOpen={isTeamLeadModalOpen}
                onClose={() => setIsTeamLeadModalOpen(false)}
                employee={selectedEmployee}
                teams={teams}
                handleAssignTeamLead={handleAssignTeamLead}
                handleRevokeTeamLead={handleRevokeTeamLead}
                handleAssignEmployee={handleAssignEmployee}
                handleMoveMember={handleMoveMember}
                handleRemoveMemberFromTeam={handleRemoveMemberFromTeam}
                addNotification={addNotification}
                refreshAllData={refreshAllData}
            />


            <div className="notification-container">
                {notifications.map((note) => (
                    <Notification
                        key={note.id}
                        type={note.type}
                        message={note.message}
                        onClose={() =>
                            setNotifications((prev) =>
                                prev.filter((n) => n.id !== note.id)
                            )
                        }
                    />
                ))}
            </div>
        </div>
    );
}
