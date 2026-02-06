import closeIcon from "@assets/Close.svg";
import './employee-modal.css';
export default function EmployeeModal({
    activeEmployee,
    setActiveEmployee,
    teams,
    addNotification,
    assignToTeamId,
    setAssignToTeamId,
    handleAssignEmployee,
    moveToTeamId,
    setMoveToTeamId,
    handleMoveMember,
    removeFromTeamId,
    setRemoveFromTeamId,
    handleRemoveMemberFromTeam,
    accessTeamId,
    setAccessTeamId,
    handleGiveAccess,
    refreshAllData
}) {
    if (!activeEmployee) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-employee-content">

                {/* HEADER */}
                <div className="modal-employee-header">
                    <h3>Сотрудник {activeEmployee.fullname}</h3>
                    <img
                        src={closeIcon}
                        alt="Закрыть"
                        className="close-btn"
                        onClick={() => setActiveEmployee(null)}
                    />
                </div>
                <div className="employee-stroka"></div>
                <div className="s123">
                    <div className="modal-employee-section">
                        <h4>Добавить сотрудника в другую команду?</h4>

                        <select
                            value={assignToTeamId}
                            onChange={(e) => setAssignToTeamId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>

                            {teams
                                // 🔥 скрываем все команды, где сотрудник уже состоит
                                .filter(t =>
                                    !(activeEmployee.teams || []).some(team => team.id === t.team.id)
                                )
                                .map(t => (
                                    <option key={t.team.id} value={t.team.id}>
                                        {t.team.name}
                                    </option>
                                ))}
                        </select>


                        <button
                            className="btn-add"
                            onClick={() => {
                                if (!assignToTeamId) {
                                    return addNotification("error", "Ошибка");
                                }
                                handleAssignEmployee(activeEmployee.id, assignToTeamId, async () => {
                                    addNotification("success", "Успешно");
                                    await refreshAllData();
                                    setAssignToTeamId("");
                                    setActiveEmployee(null);
                                });
                            }}
                        >
                            Добавить
                        </button>
                    </div>

                    {/* Переместить сотрудника */}
                    <div className="modal-employee-section">
                        <h4>Переместить сотрудника в другую команду?</h4>

                        <select
                            value={moveToTeamId}
                            onChange={(e) => setMoveToTeamId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>

                            {teams
                                // 🔥 скрываем все команды, где сотрудник уже состоит
                                .filter(t =>
                                    !(activeEmployee.teams || []).some(team => team.id === t.team.id)
                                )
                                .map(t => (
                                    <option key={t.team.id} value={t.team.id}>
                                        {t.team.name}
                                    </option>
                                ))}
                        </select>




                        <button
                            className="btn-add"
                            onClick={() => {
                                if (!moveToTeamId) {
                                    return addNotification("error", "Ошибка");
                                }
                                handleMoveMember(activeEmployee.id, activeEmployee.teamId, moveToTeamId, async () => {
                                    addNotification("success", "Успешно");
                                    await refreshAllData();
                                    setMoveToTeamId("");
                                    setActiveEmployee(null);
                                });
                            }}
                        >
                            Переместить
                        </button>
                    </div>

                    {/* Выдать доступ */}
                    <div className="modal-em-teamlead-section">
                        <h4>Сделать тимлидом?</h4>

                        <button
                            className="btn-add"
                            onClick={() => {
                                handleAssignTeamLead(
                                    activeEmployee.teamId,
                                    activeEmployee.id,
                                    async () => {
                                        addNotification("success", "Сотрудник назначен тимлидом");
                                        await refreshAllData();
                                        setActiveEmployee(null);
                                    },
                                    (err) => {
                                        console.error(err);
                                        addNotification("error", "Ошибка назначения");
                                    }
                                );
                            }}
                        >
                            Назначить тимлидом
                        </button>
                    </div>


                    {/* Удалить из команды */}
                    <div className="modal-employee-section">
                        <h4>Удалить сотрудника из команды?</h4>

                        <select
                            value={removeFromTeamId}
                            onChange={(e) => setRemoveFromTeamId(e.target.value)}>
                            <option value="">Выберите команду</option>

                            {activeEmployee.teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>


                        <button
                            className="btn-del-employee"
                            onClick={() => {
                                if (!removeFromTeamId) return addNotification("error", "Ошибка");

                                handleRemoveMemberFromTeam(removeFromTeamId, activeEmployee.id, async () => {
                                    addNotification("success", "Удалён");
                                    await refreshAllData();
                                    setRemoveFromTeamId("");
                                    setActiveEmployee(null);
                                });
                            }}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
