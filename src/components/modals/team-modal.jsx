import closeIcon from "@assets/Close.svg";
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
    if (!activeTeamModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-team-content">
                <div className="modal-header">
                    <h3>Команда {activeTeamModal.teamName}</h3>
                    <img
                        src={closeIcon}
                        alt="Закрыть"
                        className="close-btn"
                        onClick={() => setActiveTeamModal(null)}
                    />
                </div>

                <div className="team-stroka"></div>

                {/* --- Добавление тимлида --- */}
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

                {/* --- Перемещение сотрудника --- */}
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
                            if (!moveUserId || !moveToTeamId) {
                                return addNotification("error", "Ошибка");
                            }

                            handleMoveMember(
                                moveUserId,
                                activeTeamModal.teamId,
                                moveToTeamId,
                                async () => {
                                    addNotification("success", "Успешно");

                                    await refreshAllData();
                                    setMoveUserId("");
                                    setMoveToTeamId("");
                                    setActiveTeamModal(null);
                                }
                            );
                        }}
                    >
                        Переместить
                    </button>
                </div>

                {/* --- Удаление сотрудника --- */}
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
                            if (!removeUserId)
                                return addNotification("error", "Ошибка");

                            handleRemoveMemberFromTeam(
                                activeTeamModal.teamId,
                                removeUserId,
                                async () => {
                                    addNotification("success", "Успешно");
                                    await refreshAllData();
                                    setRemoveUserId("");
                                    setActiveTeamModal(null);
                                }
                            );
                        }}
                    >
                        Удалить
                    </button>
                </div>

                {/* --- Удаление команды --- */}
                <div className="modal-team-section">
                    <h4>Удалить команду?</h4>

                    <div className="modal-buttons">
                        <button
                            className="btn-del"
                            onClick={() => {
                                handleDeleteTeam(
                                    activeTeamModal.teamId,
                                    async () => {
                                        addNotification("success", "Успешно");
                                        await refreshAllData();
                                        setActiveTeamModal(null);
                                    }
                                );
                            }}
                        >
                            Удалить
                        </button>

                        <button
                            className="btn-cancel"
                            onClick={() => setActiveTeamModal(null)}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
