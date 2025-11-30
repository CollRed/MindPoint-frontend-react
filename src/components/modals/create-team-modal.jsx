import React from "react";
import infoIcon from "@assets/info.svg";
import questionIcon from "@assets/question.svg";
import './create-team-modal.css';

export default function CreateTeamModal({
    isCreateTeamOpen,
    isCreateConfirmOpen,
    newTeamName,
    setNewTeamName,
    setIsCreateTeamOpen,
    setIsCreateConfirmOpen,
    addNotification,
    handleCreateTeam,
    refreshAllData,
}) {
    if (!isCreateTeamOpen) return null;

    return (
        <>
            {!isCreateConfirmOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-icon">
                            <img src={infoIcon} alt="?" />
                        </div>
                        <div className="modal-text">
                            <h3>Добавить команду</h3>

                            <input
                                type="text"
                                className="modal-input"
                                placeholder="Введите название команды"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                            />

                            <div className="modal-buttons">
                                <button
                                    className="btn-yes"
                                    onClick={() => {
                                        if (!newTeamName.trim()) {
                                            addNotification("error", "Ошибка");
                                            return;
                                        }
                                        setIsCreateConfirmOpen(true);
                                    }}
                                >
                                    Добавить
                                </button>

                                <button
                                    className="btn-no"
                                    onClick={() => {
                                        setIsCreateTeamOpen(false);
                                        setNewTeamName("");
                                    }}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isCreateConfirmOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-icon">
                            <img src={questionIcon} alt="?" />
                        </div>
                        <p className="modal-text">
                            Вы уверены, что хотите добавить команду <br />
                            <b>“{newTeamName}”</b>?
                        </p>

                        <div className="modal-buttons">
                            <button
                                className="btn-yes"
                                onClick={() => {
                                    handleCreateTeam(
                                        newTeamName,
                                        async () => {
                                            addNotification("success", "Успешно");
                                            await refreshAllData();
                                            setIsCreateTeamOpen(false);
                                            setIsCreateConfirmOpen(false);
                                            setNewTeamName("");
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
                                className="btn-no"
                                onClick={() => setIsCreateConfirmOpen(false)}
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
