import { useState } from "react";
import "./teamlead-modal.css";

import closeIconModal from "@assets/close-team-modal.svg";
import leadIconModal from "@assets/lead-icon-modal.svg";
import deleteIconModal from "@assets/delete-icon-modal.svg";
import iconModalTeam from "@assets/icon-modal-team.svg";
import infoIcon from "@assets/info.svg";
import questionIcon from "@assets/question.svg";
import plusIconModal from "@assets/plus-icon-modal.svg";

export default function TeamLeadModal({
                                          isOpen,
                                          onClose,
                                          employee,
                                          teams,
                                          addNotification,
                                          handleAssignTeamLead,
                                          handleRevokeTeamLead,
                                          handleAssignEmployee,
                                          handleMoveMember,
                                          handleRemoveMemberFromTeam,
                                          refreshAllData
                                      }) {
    const [mode, setMode] = useState(null);

    const [moveToTeamId, setMoveToTeamId] = useState("");
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [assignAccessId, setAssignAccessId] = useState("");

    if (!isOpen || !employee) return null;

    const closeAll = () => {
        setMode(null);
        setMoveToTeamId("");
        setSelectedTeamId("");
        setAssignAccessId("");
        onClose();
    };

    const selectedMoveTeam = teams.find(
        t => String(t.team.id) === String(moveToTeamId)
    )?.team;

    const selectedAddTeam = teams.find(
        t => String(t.team.id) === String(selectedTeamId)
    )?.team;

    const selectedAssignTeam = teams.find(
        t => String(t.team.id) === String(assignAccessId)
    )?.team;

    return (
        <>
            {mode === null && (
                <div className="modal-overlay">
                    <div className="modal-teamlead-content">
                        <div className="teamlead-header">
                            <h3>Тимлид</h3>
                            <img
                                src={closeIconModal}
                                alt="Закрыть"
                                className="close-btn-teamlead"
                                onClick={closeAll}
                            />
                        </div>

                        <div className="teamlead-actions">
                            <div className="teamlead-action-card" onClick={() => setMode("move")}>
                                <img src={iconModalTeam} className="action-icon" alt="" />
                                <span>Переместить</span>
                            </div>

                            <div className="teamlead-action-card" onClick={() => setMode("add")}>
                                <img src={plusIconModal} className="action-icon" alt="" />
                                <span>Добавить</span>
                            </div>

                            <div className="teamlead-action-card danger" onClick={() => setMode("removeConfirm")}>
                                <img src={deleteIconModal} className="action-icon" alt="" />
                                <span>Удалить</span>
                            </div>

                            <div className="teamlead-action-card" onClick={() => setMode("giveAccess")}>
                                <img src={leadIconModal} className="action-icon" alt="" />
                                <span>Дать доступ</span>
                            </div>

                            <div className="teamlead-action-card danger" onClick={() => setMode("revokeAccessConfirm")}>
                                <img src={deleteIconModal} className="action-icon" alt="" />
                                <span>Забрать доступ</span>
                            </div>
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
                            {teams
                                .filter(t => !(employee.teams || []).some(et => String(et.id) === String(t.team.id)))
                                .map(t => (
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
                            <b>{employee.fullname}</b> в команду{" "}
                            <b>“{selectedMoveTeam?.name}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleMoveMember(
                                        employee.id,
                                        employee.currentTeamId,
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
                            {teams
                                .filter(t => !(employee.teams || []).some(et => String(et.id) === String(t.team.id)))
                                .map(t => (
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
                            <b>{employee.fullname}</b> в команду{" "}
                            <b>“{selectedAddTeam?.name}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleAssignEmployee(
                                        employee.id,
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

            {mode === "giveAccess" && (
                <div className="modal-overlay">
                    <div className="team-action-modal">
                        <div className="action-info-icon">
                            <img src={infoIcon} alt="info" />
                        </div>

                        <h4 className="team-form-title">Дать доступ до команды</h4>

                        <select
                            className={assignAccessId ? "select-active" : "select-placeholder"}
                            value={assignAccessId}
                            onChange={(e) => setAssignAccessId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>
                            {teams.map(t => (
                                <option key={t.team.id} value={t.team.id}>
                                    {t.team.name}
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
                                Дать доступ
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
                            <b>{employee.fullname}</b> доступ к <br />
                            статистике команды <b>“{selectedAssignTeam?.name}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleAssignTeamLead(
                                        assignAccessId,
                                        employee.id,
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
                            Вы уверены, что хотите удалить сотрудника <b>{employee.fullname}</b> из команды?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleRemoveMemberFromTeam(
                                        employee.currentTeamId,
                                        employee.id,
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

            {mode === "revokeAccessConfirm" && (
                <div className="modal-overlay">
                    <div className="team-confirm-modal">
                        <div className="action-info-icon">
                            <img src={questionIcon} alt="question" />
                        </div>

                        <p className="confirm-text">
                            Вы уверены, что хотите забрать доступ к <br />
                            статистике команды <b>“{employee.currentTeamName}”</b> <br />
                            у <b>“{employee.fullname}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleRevokeTeamLead(
                                        employee.currentTeamId,
                                        employee.id,
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