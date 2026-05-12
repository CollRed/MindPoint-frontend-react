import closeIcon from "@assets/Close.svg";
import infoIcon from "@assets/info.svg";
import questionIcon from "@assets/question.svg";
import closeIconModal from "@assets/close-team-modal.svg";
import leadIconModal from "@assets/lead-icon-modal.svg";
import deleteIconModal from "@assets/delete-icon-modal.svg";
import iconModalTeam from "@assets/icon-modal-team.svg";
import { useState } from "react";
import './team-modal.css';

export default function TeamModal({
                                      activeTeamModal,
                                      setActiveTeamModal,
                                      selectedLeadId,
                                      setSelectedLeadId,
                                      moveUserId,
                                      setMoveUserId,
                                      moveToTeamId,
                                      setMoveToTeamId,
                                      removeUserId,
                                      setRemoveUserId,
                                      teams,
                                      handleAssignTeamLead,
                                      handleMoveMember,
                                      handleRemoveMemberFromTeam,
                                      handleDeleteTeam,
                                      refreshAllData,
                                      addNotification,
                                  }) {
    const [mode, setMode] = useState(null);

    if (!activeTeamModal) return null;

    const selectedLead = activeTeamModal.members?.find(
        (m) => String(m.id) === String(selectedLeadId)
    );

    const selectedMoveUser = activeTeamModal.members?.find(
        (m) => String(m.id) === String(moveUserId)
    );

    const selectedMoveTeam = teams?.find(
        (t) => String(t.team.id) === String(moveToTeamId)
    )?.team;

    const selectedRemoveUser = activeTeamModal.members?.find(
        (m) => String(m.id) === String(removeUserId)
    );

    const closeAll = () => {
        setSelectedLeadId("");
        setMode(null);
        setActiveTeamModal(null);
    };

    return (
        <>
            {mode === null && (
                <div className="modal-overlay">
                    <div className="modal-team-content">
                        <div className="modal-header">
                            <h3>Команда {activeTeamModal.teamName}</h3>
                            <img
                                src={closeIcon}
                                alt="Закрыть"
                                className="close-btn-team"
                                onClick={closeAll}
                            />
                        </div>

                        <div className="team-actions">
                            <div className="team-action-card" onClick={() => setMode("lead")}>
                                <img src={leadIconModal} alt="lead" className="action-icon" />
                                <span>Добавить тимлида</span>
                            </div>

                            <div className="team-action-card" onClick={() => setMode("move")}>
                                <img src={iconModalTeam} alt="move" className="action-icon" />
                                <span>Переместить сотрудника</span>
                            </div>

                            <div className="team-action-card danger" onClick={() => setMode("remove")}>
                                <img src={deleteIconModal} alt="remove" className="action-icon" />
                                <span>Удалить сотрудника</span>
                            </div>

                            <div
                                className="team-action-card danger"
                                onClick={() => setMode("deleteTeamConfirm")}
                            >
                                <img src={closeIconModal} alt="remove" className="action-icon" />
                                <span>Удалить команду</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mode === "lead" && (
                <div className="modal-overlay">
                    <div className="team-action-modal">
                        <div className="action-info-icon">
                            <img src={infoIcon} alt="info" />
                        </div>

                        <h4 className="team-form-title">Добавить тимлида</h4>

                        <select
                            className={selectedLeadId ? "select-active" : "select-placeholder"}
                            value={selectedLeadId}
                            onChange={(e) => setSelectedLeadId(e.target.value)}
                        >
                            <option value="">ФИО</option>
                            {activeTeamModal.members
                                .filter((m) => !m.is_teamlead)
                                .map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.fullname}
                                    </option>
                                ))}
                        </select>

                        <div className="team-form-buttons">
                            <button
                                className="btn-add-team"
                                onClick={() => {
                                    if (!selectedLeadId) {
                                        addNotification("error", "Выберите сотрудника");
                                        return;
                                    }

                                    setMode("leadConfirm");
                                }}
                            >
                                Добавить
                            </button>

                            <button
                                className="btn-cancel-team"
                                onClick={() => {
                                    setSelectedLeadId("");
                                    setMode(null);
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === "leadConfirm" && (
                <div className="modal-overlay">
                    <div className="team-confirm-modal">
                        <div className="action-info-icon">
                            <img src={questionIcon} alt="question" />
                        </div>

                        <p className="confirm-text">
                            Вы уверены, что хотите предоставить <br />
                            <b>“{selectedLead?.fullname}”</b> доступ к <br />
                            статистике команды <b>“{activeTeamModal.teamName}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleAssignTeamLead(
                                        activeTeamModal.teamId,
                                        selectedLeadId,
                                        async () => {
                                            addNotification("success", "Успешно");
                                            await refreshAllData();
                                            setSelectedLeadId("");
                                            setMode(null);
                                            setActiveTeamModal(null);
                                        },
                                        (err) => {
                                            addNotification("error", "Ошибка");
                                            console.error(err);
                                        }
                                    );
                                }}
                            >
                                Да
                            </button>

                            <button
                                className="btn-cancel-confirm"
                                onClick={() => setMode("lead")}
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
                            className={moveUserId ? "select-active" : "select-placeholder"}
                            value={moveUserId}
                            onChange={(e) => setMoveUserId(e.target.value)}
                        >
                            <option value="">ФИО</option>
                            {activeTeamModal.members.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.fullname}
                                </option>
                            ))}
                        </select>

                        <select
                            className={moveToTeamId ? "select-active" : "select-placeholder"}
                            value={moveToTeamId}
                            onChange={(e) => setMoveToTeamId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>
                            {teams
                                .filter((t) => String(t.team.id) !== String(activeTeamModal.teamId))
                                .map((t) => (
                                    <option key={t.team.id} value={t.team.id}>
                                        {t.team.name}
                                    </option>
                                ))}
                        </select>

                        <div className="team-form-buttons">
                            <button
                                className="btn-add-team"
                                onClick={() => {
                                    if (!moveUserId || !moveToTeamId) {
                                        addNotification("error", "Заполните все поля");
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
                                    setMoveUserId("");
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
                            <b>{selectedMoveUser?.fullname}</b> в команду{" "}
                            <b>“{selectedMoveTeam?.name}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleMoveMember(
                                        moveUserId,
                                        activeTeamModal.teamId,
                                        moveToTeamId,
                                        async () => {
                                            addNotification("success", "Успешно");
                                            await refreshAllData();

                                            setMoveUserId("");
                                            setMoveToTeamId("");
                                            setMode(null);
                                            setActiveTeamModal(null);
                                        }
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
            {mode === "remove" && (
                <div className="modal-overlay">
                    <div className="team-action-modal">
                        <div className="action-info-icon">
                            <img src={infoIcon} alt="info" />
                        </div>

                        <h4 className="team-form-title">
                            Удалить сотрудника из команды
                        </h4>

                        <select
                            className={removeUserId ? "select-active" : "select-placeholder"}
                            value={removeUserId}
                            onChange={(e) => setRemoveUserId(e.target.value)}
                        >
                            <option value="">ФИО</option>
                            {activeTeamModal.members.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.fullname}
                                </option>
                            ))}
                        </select>

                        <div className="team-form-buttons">
                            <button
                                className="btn-add-team"
                                onClick={() => {
                                    if (!removeUserId) {
                                        addNotification("error", "Выберите сотрудника");
                                        return;
                                    }

                                    setMode("removeConfirm");
                                }}
                            >
                                Удалить
                            </button>

                            <button
                                className="btn-cancel-team"
                                onClick={() => {
                                    setRemoveUserId("");
                                    setMode(null);
                                }}
                            >
                                Отмена
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
                            Вы уверены, что хотите удалить сотрудника <br />
                            <b>{selectedRemoveUser?.fullname}</b> из команды?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleRemoveMemberFromTeam(
                                        activeTeamModal.teamId,
                                        removeUserId,
                                        async () => {
                                            addNotification("success", "Успешно");
                                            await refreshAllData();

                                            setRemoveUserId("");
                                            setMode(null);
                                            setActiveTeamModal(null);
                                        }
                                    );
                                }}
                            >
                                Да
                            </button>

                            <button
                                className="btn-cancel-confirm"
                                onClick={() => setMode("remove")}
                            >
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {mode === "deleteTeamConfirm" && (
                <div className="modal-overlay">
                    <div className="team-confirm-modal">
                        <div className="action-info-icon">
                            <img src={questionIcon} alt="question" />
                        </div>

                        <p className="confirm-text">
                            Вы уверены, что хотите удалить команду <br />
                            <b>“{activeTeamModal.teamName}”</b>?
                        </p>

                        <div className="confirm-buttons">
                            <button
                                className="btn-add-confirm"
                                onClick={() => {
                                    handleDeleteTeam(
                                        activeTeamModal.teamId,
                                        async () => {
                                            addNotification("success", "Успешно");
                                            await refreshAllData();

                                            setMode(null);
                                            setActiveTeamModal(null);
                                        }
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