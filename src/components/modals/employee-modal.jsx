import { useState } from "react";
import "./teamlead-modal.css";

import closeIconModal from "@assets/close-team-modal.svg";
import leadIconModal from "@assets/lead-icon-modal.svg";
import deleteIconModal from "@assets/delete-icon-modal.svg";
import iconModalTeam from "@assets/icon-modal-team.svg";
import infoIcon from "@assets/info.svg";
import questionIcon from "@assets/question.svg";
import plusIconModal from "@assets/plus-icon-modal.svg";

export default function EmployeeModal({
                                          activeEmployee,
                                          setActiveEmployee,
                                          teams,
                                          addNotification,
                                          handleAssignEmployee,
                                          handleMoveMember,
                                          handleRemoveMemberFromTeam,
                                          handleAssignTeamLead,
                                          refreshAllData
                                      }) {
    const [mode, setMode] = useState(null);

    const [moveToTeamId, setMoveToTeamId] = useState("");
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [removeFromTeamId, setRemoveFromTeamId] = useState("");
    const [assignAccessId, setAssignAccessId] = useState("");

    if (!activeEmployee) return null;

    const closeAll = () => {
        setMode(null);
        setMoveToTeamId("");
        setSelectedTeamId("");
        setRemoveFromTeamId("");
        setAssignAccessId("");
        setActiveEmployee(null);
    };

    const employeeTeams = activeEmployee.teams || [];

    const availableTeams = teams.filter(t =>
        !employeeTeams.some(et => String(et.id) === String(t.team.id))
    );

    const selectedMoveTeam = teams.find(
        t => String(t.team.id) === String(moveToTeamId)
    )?.team;

    const selectedAddTeam = teams.find(
        t => String(t.team.id) === String(selectedTeamId)
    )?.team;

    const selectedRemoveTeam = employeeTeams.find(
        t => String(t.id) === String(removeFromTeamId)
    );

    const selectedAssignTeam = employeeTeams.find(
        t => String(t.id) === String(assignAccessId)
    );

    return (
        <>
            {mode === null && (
                <div className="modal-overlay">
                    <div className="modal-teamlead-content">
                        <div className="teamlead-header">
                            <h3>Сотрудник</h3>

                            <img
                                src={closeIconModal}
                                alt="Закрыть"
                                className="close-btn-teamlead"
                                onClick={closeAll}
                            />
                        </div>

                        <div className="teamlead-actions">
                            <div
                                className="teamlead-action-card"
                                onClick={() => setMode("add")}
                            >
                                <img src={plusIconModal} className="action-icon" alt="" />
                                <span>Добавить</span>
                            </div>

                            <div
                                className="teamlead-action-card"
                                onClick={() => setMode("move")}
                            >
                                <img src={iconModalTeam} className="action-icon" alt="" />
                                <span>Переместить</span>
                            </div>

                            <div
                                className="teamlead-action-card"
                                onClick={() => setMode("giveAccess")}
                            >
                                <img src={leadIconModal} className="action-icon" alt="" />
                                <span>Выдать доступ</span>
                            </div>

                            <div
                                className="teamlead-action-card danger"
                                onClick={() => setMode("removeConfirm")}
                            >
                                <img src={deleteIconModal} className="action-icon" alt="" />
                                <span>Удалить сотрудника</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mode === "add" && (
                <div className="modal-overlay">
                    <div className="team-action-modal">
                        <div className="action-info-icon">
                            <img src={infoIcon} alt="info" />
                        </div>

                        <h4 className="team-form-title">
                            Добавить сотрудника в другую команду
                        </h4>

                        <select
                            className={selectedTeamId ? "select-active" : "select-placeholder"}
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>

                            {availableTeams.map(t => (
                                <option key={t.team.id} value={t.team.id}>
                                    {t.team.name}
                                </option>
                            ))}
                        </select>

                        <div className="team-form-buttons">
                            <button
                                className="btn-add-team"
                                onClick={() => {
                                    if (!selectedTeamId) {
                                        addNotification("error", "Выберите команду");
                                        return;
                                    }

                                    setMode("addConfirm");
                                }}
                            >
                                Добавить
                            </button>

                            <button
                                className="btn-cancel-team"
                                onClick={() => {
                                    setSelectedTeamId("");
                                    setMode(null);
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === "addConfirm" && (
                <div className="modal-overlay">
                    <div className="team-confirm-modal">
                        <div className="action-info-icon">
                            <img src={questionIcon} alt="question" />
                        </div>

                        <p className="confirm-text">
                            Вы уверены, что хотите добавить{" "}
                            <b>{activeEmployee.fullname}</b> в команду{" "}
                            <b>“{selectedAddTeam?.name}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleAssignEmployee(
                                        activeEmployee.id,
                                        selectedTeamId,
                                        async () => {
                                            addNotification("success", "Успешно");
                                            await refreshAllData();
                                            closeAll();
                                        },
                                        () => addNotification("error", "Ошибка")
                                    );
                                }}
                            >
                                Да
                            </button>

                            <button
                                className="btn-cancel-confirm"
                                onClick={() => setMode("add")}
                            >
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === "move" && (
                <div className="modal-overlay">
                    <div className="team-action-modal">
                        <div className="action-info-icon">
                            <img src={infoIcon} alt="info" />
                        </div>

                        <h4 className="team-form-title">
                            Переместить сотрудника в другую команду
                        </h4>

                        <select
                            className={moveToTeamId ? "select-active" : "select-placeholder"}
                            value={moveToTeamId}
                            onChange={(e) => setMoveToTeamId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>

                            {availableTeams.map(t => (
                                <option key={t.team.id} value={t.team.id}>
                                    {t.team.name}
                                </option>
                            ))}
                        </select>

                        <div className="team-form-buttons">
                            <button
                                className="btn-add-team"
                                onClick={() => {
                                    if (!moveToTeamId) {
                                        addNotification("error", "Выберите команду");
                                        return;
                                    }

                                    setMode("moveConfirm");
                                }}
                            >
                                Переместить
                            </button>

                            <button
                                className="btn-cancel-team"
                                onClick={() => {
                                    setMoveToTeamId("");
                                    setMode(null);
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === "moveConfirm" && (
                <div className="modal-overlay">
                    <div className="team-confirm-modal">
                        <div className="action-info-icon">
                            <img src={questionIcon} alt="question" />
                        </div>

                        <p className="confirm-text">
                            Вы уверены, что хотите переместить{" "}
                            <b>{activeEmployee.fullname}</b> в команду{" "}
                            <b>“{selectedMoveTeam?.name}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    const fromTeamId =
                                        activeEmployee.currentTeamId ||
                                        activeEmployee.teamId ||
                                        employeeTeams?.[0]?.id;

                                    if (!fromTeamId) {
                                        addNotification("error", "Не найдена текущая команда");
                                        return;
                                    }

                                    handleMoveMember(
                                        activeEmployee.id,
                                        fromTeamId,
                                        moveToTeamId,
                                        async () => {
                                            addNotification("success", "Успешно");
                                            await refreshAllData();
                                            closeAll();
                                        },
                                        () => addNotification("error", "Ошибка")
                                    );
                                }}
                            >
                                Да
                            </button>

                            <button
                                className="btn-cancel-confirm"
                                onClick={() => setMode("move")}
                            >
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === "giveAccess" && (
                <div className="modal-overlay">
                    <div className="team-action-modal">
                        <div className="action-info-icon">
                            <img src={infoIcon} alt="info" />
                        </div>

                        <h4 className="team-form-title">
                            Выдать доступ тимлида
                        </h4>

                        <select
                            className={assignAccessId ? "select-active" : "select-placeholder"}
                            value={assignAccessId}
                            onChange={(e) => setAssignAccessId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>

                            {employeeTeams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>

                        <div className="team-form-buttons">
                            <button
                                className="btn-add-team"
                                onClick={() => {
                                    if (!assignAccessId) {
                                        addNotification("error", "Выберите команду");
                                        return;
                                    }

                                    setMode("giveAccessConfirm");
                                }}
                            >
                                Выдать доступ
                            </button>

                            <button
                                className="btn-cancel-team"
                                onClick={() => {
                                    setAssignAccessId("");
                                    setMode(null);
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === "giveAccessConfirm" && (
                <div className="modal-overlay">
                    <div className="team-confirm-modal">
                        <div className="action-info-icon">
                            <img src={questionIcon} alt="question" />
                        </div>

                        <p className="confirm-text">
                            Вы уверены, что хотите предоставить{" "}
                            <b>{activeEmployee.fullname}</b> доступ к <br />
                            статистике команды <b>“{selectedAssignTeam?.name}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleAssignTeamLead(
                                        assignAccessId,
                                        activeEmployee.id,
                                        async () => {
                                            addNotification("success", "Успешно");
                                            await refreshAllData();
                                            closeAll();
                                        },
                                        () => addNotification("error", "Ошибка")
                                    );
                                }}
                            >
                                Да
                            </button>

                            <button
                                className="btn-cancel-confirm"
                                onClick={() => setMode("giveAccess")}
                            >
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === "removeConfirm" && (
                <div className="modal-overlay">
                    <div className="team-confirm-modal">
                        <div className="action-info-icon">
                            <img src={questionIcon} alt="question" />
                        </div>

                        <p className="confirm-text">
                            Вы уверены, что хотите удалить{" "}
                            <b>{activeEmployee.fullname}</b> из команды{" "}
                            <b>“{activeEmployee.currentTeamName}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleRemoveMemberFromTeam(
                                        activeEmployee.currentTeamId,
                                        activeEmployee.id,
                                        async () => {
                                            addNotification("success", "Удалён");
                                            await refreshAllData();
                                            closeAll();
                                        },
                                        () => addNotification("error", "Ошибка")
                                    );
                                }}
                            >
                                Да
                            </button>

                            <button
                                className="btn-cancel-confirm"
                                onClick={() => setMode(null)}
                            >
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}