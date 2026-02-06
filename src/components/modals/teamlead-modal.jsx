import closeIcon from "@assets/Close.svg";
import { useState } from "react";
import "./teamlead-modal.css"; // создай, если нужно

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
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [moveToTeamId, setMoveToTeamId] = useState("");
    const [removeFromTeamId, setRemoveFromTeamId] = useState("");
    const [assignAccessId, setAssignAccessId] = useState("");
    const [revokeAccessId, setRevokeAccessId] = useState("");

    if (!isOpen || !employee) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-teamlead-content">
                {/* HEADER */}
                <div className="modal-header">
                    <h3>Тимлид {employee.fullname}</h3>
                    <img
                        src={closeIcon}
                        alt="Закрыть"
                        className="close-btn"
                        onClick={onClose}
                    />
                </div>
                <div className="teamlead-stroka"></div>
                <div className="s123">
                    {/* Выдать доступ */}
                    <div className="modal-teamlead-section">
                        <h4>Выдать доступ до команды?</h4>
                        <select
                            value={assignAccessId}
                            onChange={(e) => setAssignAccessId(e.target.value)}>
                            <option value="">Выберите команду</option>
                            {teams.map(team => (
                                <option key={team.team.id} value={team.team.id}>
                                    {team.team.name}
                                </option>
                            ))}
                        </select>
                        <button
                            className="btn-add"
                            onClick={() => {
                                if (!assignAccessId) return;
                                handleAssignTeamLead(assignAccessId, employee.id,
                                    async () => {
                                        addNotification("success", "Назначен тимлидом");
                                        await refreshAllData();
                                        setAssignAccessId("");
                                    },
                                    () => addNotification("error", "Ошибка")
                                );
                            }}>
                            Выдать доступ
                        </button>
                    </div>

                    {/* Забрать доступ */}
                    <div className="modal-teamlead-section">
                        <h4>Забрать доступ тимлида до команды?</h4>
                        <select
                            value={revokeAccessId}
                            onChange={(e) => setRevokeAccessId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>
                            {(employee.teams || []).map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                        <button
                            className="btn-del-teamlead "
                            onClick={() => {
                                if (!revokeAccessId) return;
                                handleRevokeTeamLead(revokeAccessId, employee.id,
                                    async () => {
                                        addNotification("success", "Доступ снят");
                                        await refreshAllData();
                                        setRevokeAccessId("");
                                    },
                                    () => addNotification("error", "Ошибка")
                                );
                            }}
                        >
                            Забрать доступ
                        </button>
                    </div>

                    {/* Добавить в команду */}
                    <div className="modal-teamlead-section">
                        <h4>Добавить сотрудника в другую команду?</h4>
                        <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>
                            {teams
                                .filter(t => !(employee.teams || []).some(et => et.id === t.team.id))
                                .map(t => (
                                    <option key={t.team.id} value={t.team.id}>
                                        {t.team.name}
                                    </option>
                                ))}
                        </select>
                        <button
                            className="btn-add"
                            onClick={() => {
                                if (!selectedTeamId) return;
                                handleAssignEmployee(employee.id, selectedTeamId,
                                    async () => {
                                        addNotification("success", "Добавлен в команду");
                                        await refreshAllData();
                                        setSelectedTeamId("");
                                    },
                                    () => addNotification("error", "Ошибка")
                                );
                            }}
                        >
                            Добавить
                        </button>
                    </div>

                    {/* Переместить */}
                    <div className="modal-teamlead-section">
                        <h4>Переместить сотрудника в другую команду?</h4>
                        <select
                            value={moveToTeamId}
                            onChange={(e) => setMoveToTeamId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>
                            {teams
                                .filter(t => !(employee.teams || []).some(et => et.id === t.team.id))
                                .map(t => (
                                    <option key={t.team.id} value={t.team.id}>
                                        {t.team.name}
                                    </option>
                                ))}
                        </select>
                        <button
                            className="btn-add"
                            onClick={() => {
                                if (!moveToTeamId || !employee.teamId) return;
                                handleMoveMember(employee.id, employee.teamId, moveToTeamId,
                                    async () => {
                                        addNotification("success", "Перемещён");
                                        await refreshAllData();
                                        setMoveToTeamId("");
                                    },
                                    () => addNotification("error", "Ошибка")
                                );
                            }}
                        >
                            Переместить
                        </button>
                    </div>

                    {/* Удалить из команды */}
                    <div className="modal-teamlead-section">
                        <h4>Удалить сотрудника из команды?</h4>
                        <select
                            value={removeFromTeamId}
                            onChange={(e) => setRemoveFromTeamId(e.target.value)}
                        >
                            <option value="">Выберите команду</option>
                            {(employee.teams || []).map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                        <button
                            className="btn-del-teamlead "
                            onClick={() => {
                                if (!removeFromTeamId) return;
                                handleRemoveMemberFromTeam(removeFromTeamId, employee.id,
                                    async () => {
                                        addNotification("success", "Удалён");
                                        await refreshAllData();
                                        setRemoveFromTeamId("");
                                    },
                                    () => addNotification("error", "Ошибка")
                                );
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
