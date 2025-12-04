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
} from "../../hooks/management.js";
import './employees.css';
import Pagination from "../../components/pagination/pagination.jsx";
import Notification from "../../components/notification/notification.jsx";
import CreateTeamModal from "../../components/modals/create-team-modal.jsx";
import cloudPlace from "@assets/cloud-place.svg";
import approveIcon from "@assets/approve.svg";
import cancelIcon from "@assets/cancel.svg";
import questionIcon from "@assets/question.svg";
import inviteIcon from "@assets/invite-team.svg"
import deleteIcon from "@assets/delete-employee.svg"
import infoIcon from "@assets/info.svg";
import plusIcon from "@assets/plus-icon.svg"
import downIcon from "@assets/down-icon.svg"
import closeIcon from "@assets/Close.svg"

export default function EmployeesPage() {
    const { employees, setEmployees, loadingEmployees, errorEmployees } = useEmployees();
    const { managerRequests, setManagerRequests, loadingRequests, errorRequests } = useManagerRequests();
    const { teams, setTeams } = useTeams();
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

    const [notifications, setNotifications] = useState([]);
    function addNotification(type, message) {
        setNotifications((prev) => [
            ...prev,
            { id: Date.now(), type, message }, // уникальный id
        ]);
    }

    const [confirmModal, setConfirmModal] = useState(initialConfirmModalState);

    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");
    const [isCreateConfirmOpen, setIsCreateConfirmOpen] = useState(false);

    // 🔹 Обработка действий
    const onRespond = (requestId, isApproved) => {
        handleRespond(requestId, isApproved, setManagerRequests);
    };

    const onAssignEmployee = (employeeId, teamId, employeeName) => {
        handleAssignEmployee(employeeId, teamId, employeeName);
    };

    // 🔹 Запросы на добавление в компанию
    const itemsPerPageRequests = 5;
    const [currentPageRequests, setCurrentPageRequests] = useState(1);
    const totalPagesRequests = Math.ceil(managerRequests.length / itemsPerPageRequests);
    const paginatedRequests = managerRequests.slice(
        (currentPageRequests - 1) * itemsPerPageRequests,
        currentPageRequests * itemsPerPageRequests
    );
    useEffect(() => {
        if (currentPageRequests > totalPagesRequests && totalPagesRequests > 0) {
            setCurrentPageRequests(totalPagesRequests);
        }
    }, [currentPageRequests, totalPagesRequests]);

    // 🔹 Сотрудники без команд
    const employeesWithoutTeam = employees.filter(e => !Array.isArray(e.teams) || e.teams.length === 0);
    const itemsPerPageEmployees = 5;
    const [currentPageEmployees, setCurrentPageEmployees] = useState(1);
    const totalPagesEmployees = Math.ceil(employeesWithoutTeam.length / itemsPerPageEmployees);
    const paginatedEmployees = employeesWithoutTeam.slice(
        (currentPageEmployees - 1) * itemsPerPageEmployees,
        currentPageEmployees * itemsPerPageEmployees
    );
    useEffect(() => {
        if (currentPageEmployees > totalPagesEmployees && totalPagesEmployees > 0) {
            setCurrentPageEmployees(totalPagesEmployees);
        }
    }, [currentPageEmployees, totalPagesEmployees]);

    // 🔹 Списки команд
    const itemsPerPageTeams = 13;
    const [currentPageTeams, setCurrentPageTeams] = useState(1);
    const [expandedTeams, setExpandedTeams] = useState({});
    const [openTeamIds, setOpenTeamIds] = useState([]);


    function paginateTeamsRowByRow(teams, expandedTeams, openTeamIds, itemsPerPage) {
        const rows = [];

        for (const teamData of teams) {
            if (!teamData || !teamData.team || !teamData.team.id) continue;

            const teamId = teamData.team.id;
            const members =
                expandedTeams[teamId] ?? (Array.isArray(teamData.members) ? teamData.members : []);

            // Добавляем команду
            rows.push({
                type: "team",
                team: teamData.team,
                membersCount: members.length,
                members: members,
            });

            // Если команда раскрыта — добавляем участников
            if (openTeamIds.includes(teamId)) {
                const sortedMembers = [...members].sort((a, b) => Number(b.is_teamlead) - Number(a.is_teamlead));
                for (const member of sortedMembers) {
                    rows.push({
                        type: "member",
                        member,
                        teamId,
                    });
                }
            }
        }

        const pages = [];
        for (let i = 0; i < rows.length; i += itemsPerPage) {
            pages.push(rows.slice(i, i + itemsPerPage));
        }

        return pages;
    }






    const teamPages = useMemo(() => paginateTeamsRowByRow(teams, expandedTeams, openTeamIds, itemsPerPageTeams), [teams, expandedTeams, openTeamIds]);
    const totalPagesTeams = teamPages.length;
    const paginatedTeams = teamPages[currentPageTeams - 1] || [];


    useEffect(() => {
        const total = teamPages.length;
        if (currentPageTeams > total && total > 0) {
            setCurrentPageTeams(total);
        }
    }, [teamPages]);

    useEffect(() => {
        async function preloadAllTeamMembers() {
            const expanded = {};

            for (const teamData of teams) {
                if (!teamData?.team?.id) continue;
                const teamId = teamData.team.id;

                try {
                    const response = await getTeamMembers(teamId);
                    expanded[teamId] = response?.members || [];
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

            for (const teamId of openTeamIds) {
                try {
                    const response = await getTeamMembers(teamId);
                    const members = response?.members || [];
                    updatedExpandedTeams[teamId] = members;

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
                <input type="text" placeholder="Поиск..." className="search-input" />
                <select className="filter-select">
                    <option>Фильтр</option>
                </select>
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
                            {loadingRequests ? (
                                <div className="loading">Загрузка...</div>
                            ) : errorRequests ? (
                                <div className="error">{errorRequests}</div>
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
                                                        index === paginatedTeams.length - 1 ? "last-row" : ""
                                                    }`}
                                                >
                                                    <div className="team-name">
                                                        <img
                                                            src={downIcon}
                                                            alt="Открыть"
                                                            className={`down-icon ${
                                                                openTeamIds.includes(row.team.id) ? "rotated" : ""
                                                            } ${
                                                                (expandedTeams[row.team.id] || []).length === 0
                                                                    ? "disabled"
                                                                    : ""
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const members = expandedTeams[row.team.id] || [];
                                                                members.length > 0 && toggleTeam(row.team.id);
                                                            }}
                                                        />

                                                        <span
                                                            className="team-name-text"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveTeamModal({
                                                                    teamId: row.team.id,
                                                                    teamName: row.team.name,
                                                                    members: expandedTeams[row.team.id] || [],
                                                                });
                                                            }}
                                                        >
                                    {row.team.name}
                                </span>
                                                    </div>

                                                    <div className="team-count">{row.membersCount}</div>
                                                </div>

                                                {/* блок анимации */}
                                                <div
                                                    className={`team-members-wrapper ${
                                                        openTeamIds.includes(row.team.id) ? "open" : ""
                                                    }`}
                                                >
                                                    {(expandedTeams[row.team.id] || [])
                                                        .sort((a, b) => Number(b.is_teamlead) - Number(a.is_teamlead))
                                                        .map((member, idx, arr) => (
                                                            <div
                                                                key={`member-${member.id}`}
                                                                className={`team-member-row ${
                                                                    idx === arr.length - 1 ? "last-row" : ""
                                                                }`}
                                                            >
                                        <span className="team-employee-name">
                                            {member.fullname}
                                        </span>
                                                                <span className="member-role">
                                            {member.is_teamlead ? "Тимлид" : "Сотрудник"}
                                        </span>
                                                            </div>
                                                        ))}
                                                </div>
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
                            {paginatedTeams.length > 0 && (
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
                            {paginatedTeams.length > 0 && (
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
                <div className="modal-overlay">
                    <div className="modal-team-content">
                        <div className="modal-header">
                            <h3>Команда {activeTeamModal.teamName}</h3>
                            <img src={closeIcon} alt="123" className="close-btn" onClick={() => setActiveTeamModal(null)}></img>
                        </div>
                        <div className="stroka"></div>

                        <div className="modal-team-section">
                            <h4>Добавить тимлида?</h4>
                            <select
                                value={selectedLeadId}
                                onChange={(e) => setSelectedLeadId(e.target.value)}
                            >
                                <option value="">Ф.И.О</option>
                                {activeTeamModal.members
                                    .filter(m => !m.is_teamlead)
                                    .map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.fullname}
                                        </option>
                                    ))}
                            </select>
                            <button
                                className="btn-add"
                                onClick={() => {
                                    if (!selectedLeadId) {
                                        addNotification("error", "Ошибка");
                                        return;
                                    }

                                    handleAssignTeamLead(
                                        activeTeamModal.teamId,
                                        selectedLeadId,
                                        async () => {
                                            console.log("Назначен тимлид:", selectedLeadId);
                                            addNotification("success", "Успешно");

                                            await refreshAllData();

                                            setSelectedLeadId("");
                                            setActiveTeamModal(null);
                                        },
                                        (err) => {
                                            addNotification("error", "Ошибка");
                                            console.error(err);
                                        }
                                    );
                                }}
                            >
                                Добавить
                            </button>

                        </div>

                        <div className="modal-team-section">
                            <h4>Переместить сотрудника в другую команду?</h4>
                            <select
                                value={moveUserId}
                                onChange={(e) => setMoveUserId(e.target.value)}
                            >
                                <option value="">Выберите сотрудника</option>
                                {activeTeamModal.members.map(m => (
                                    <option key={m.id} value={m.id}>{m.fullname}</option>
                                ))}
                            </select>

                            <select
                                value={moveToTeamId}
                                onChange={(e) => setMoveToTeamId(e.target.value)}
                            >
                                <option value="">Выберите команду</option>
                                {teams
                                    .filter(t => t.team.id !== activeTeamModal.teamId)
                                    .map(t => (
                                        <option key={t.team.id} value={t.team.id}>
                                            {t.team.name}
                                        </option>
                                    ))}
                            </select>

                            <button
                                className="btn-add"
                                onClick={() => {
                                    if (!moveUserId || !moveToTeamId) return addNotification("error", "Ошибка");

                                    handleMoveMember(moveUserId, activeTeamModal.teamId, moveToTeamId, async () => {
                                        addNotification("success", "Успешно");
                                        await refreshAllData();
                                        setMoveUserId("");
                                        setMoveToTeamId("");
                                        setActiveTeamModal(null);
                                    });
                                }}
                            >
                                Переместить
                            </button>
                        </div>

                        <div className="modal-team-section">
                            <h4>Удалить сотрудника из команды?</h4>
                            <select
                                value={removeUserId}
                                onChange={(e) => setRemoveUserId(e.target.value)}
                            >
                                <option value="">Выберите сотрудника</option>
                                {activeTeamModal.members.map(m => (
                                    <option key={m.id} value={m.id}>{m.fullname}</option>
                                ))}
                            </select>

                            <button
                                className="btn-add"
                                onClick={() => {
                                    if (!removeUserId) return addNotification("error", "Ошибка");

                                    handleRemoveMemberFromTeam(activeTeamModal.teamId, removeUserId, async () => {
                                        addNotification("success", "Успешно");
                                        await refreshAllData();
                                        setRemoveUserId("");
                                        setActiveTeamModal(null);
                                    });

                                }}
                            >
                                Удалить
                            </button>
                        </div>

                        <div className="modal-team-section">
                            <h4>Удалить команду?</h4>
                            <div className="modal-buttons">
                                <button className="btn-del" onClick={() => {
                                    handleDeleteTeam(activeTeamModal.teamId, async () => {
                                        addNotification("success", "Успешно");
                                        await refreshAllData();
                                        setActiveTeamModal(null);
                                    });
                                }}>
                                    Удалить
                                </button>
                                <button className="btn-cancel" onClick={() => setActiveTeamModal(null)}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
