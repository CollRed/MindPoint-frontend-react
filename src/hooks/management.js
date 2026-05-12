import { useEffect, useState } from 'react';
import { authFetch } from "../utils/authFetch";

export async function fetchEmployees() {
    const res = await authFetch('/management/get_all_employees', { credentials: 'include' });
    if (!res.ok) throw new Error("Ошибка загрузки сотрудников");
    return await res.json();
}

export function useEmployees() {
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [errorEmployees, setErrorEmployees] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoadingEmployees(true);

        fetchEmployees()
            .then(data => {
                if (isMounted) {
                    setEmployees(data);
                    setErrorEmployees(null);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setErrorEmployees("Ошибка загрузки сотрудников");
                    setEmployees([]);
                }
            })
            .finally(() => {
                if (isMounted) setLoadingEmployees(false);
            });

        return () => { isMounted = false };
    }, []);

    return { employees, setEmployees, loadingEmployees, errorEmployees };
}

export async function fetchManagerRequests() {
    const res = await authFetch('/management/manager_requests', { credentials: 'include' });
    if (!res.ok) throw new Error("Ошибка загрузки заявок");
    return await res.json();
}

export function useManagerRequests() {
    const [managerRequests, setManagerRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [errorRequests, setErrorRequests] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoadingRequests(true);

        fetchManagerRequests()
            .then(data => {
                if (isMounted) {
                    setManagerRequests(data);
                    setErrorRequests(null);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setErrorRequests("Ошибка загрузки заявок");
                    setManagerRequests([]);
                }
            })
            .finally(() => {
                if (isMounted) setLoadingRequests(false);
            });

        return () => { isMounted = false };
    }, []);

    return { managerRequests, setManagerRequests, loadingRequests, errorRequests };
}

export async function fetchTeams() {
    const res = await authFetch('/management/get_team_members', { credentials: 'include' });
    if (!res.ok) throw new Error("Ошибка загрузки команд");

    const raw = await res.json();

    // 💡 Явно оберни каждый элемент в нужный формат, если надо
    const transformed = raw.map(team => ({
        team: {
            id: team.team.id,
            name: team.team.name,
        },
        members: team.members || [],
        team_leads: team.team_leads || [],
    }));

    return transformed;
}



export function useTeams() {
    const [teams, setTeams] = useState([]);
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [errorTeams, setErrorTeams] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoadingTeams(true);

        fetchTeams()
            .then(data => {
                if (isMounted) {
                    setTeams(data);
                    setErrorTeams(null);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setErrorTeams("Ошибка загрузки команд");
                    setTeams([]);
                }
            })
            .finally(() => {
                if (isMounted) setLoadingTeams(false);
            });

        return () => { isMounted = false };
    }, []);

    return { teams, setTeams, loadingTeams, errorTeams };
}



export function handleRespond(requestId, isApproved, onSuccess, onError) {
    authFetch('/management/respond_manager_request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ request_id: requestId, approve: isApproved }),
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Ошибка ответа на заявку:', text);
                if (onError) onError(text);
                return;
            }

            if (onSuccess) onSuccess();
        })
        .catch(err => {
            console.error('Ошибка сети:', err);
            if (onError) onError(err);
        });
}


export function handleAssignEmployee(employeeId, teamId, onSuccess, onError) {
    authFetch('/management/add_members_in_team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ team_id: teamId, user_ids: [employeeId] }),
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Ошибка при назначении сотрудника:', text);
                if (onError) onError(text);
                return;
            }

            if (onSuccess) onSuccess();
        })
        .catch(err => {
            console.error('Ошибка сети при назначении:', err);
            if (onError) onError(err);
        });
}


export function handleDeleteEmployee(employeeId, employeeName, onSuccess, onError) {
    authFetch(`/management/remove_member_from_company/${employeeId}`, {
        method: 'DELETE',
        credentials: 'include',
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Ошибка при удалении сотрудника:', text);

                if (onError) onError(text);
                return;
            }


            if (onSuccess) onSuccess(); // 👈 ключевой момент
        })
        .catch(err => {
            console.error('Ошибка сети при удалении:', err);

            if (onError) onError(err);
        });
}


export function handleCreateTeam(teamName, onSuccess, onError) {
    authFetch('/management/create_team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: teamName }),
    })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Ошибка создания команды:', text);
                if (onError) onError(text);
                return;
            }


            if (onSuccess) onSuccess(); // 👈 ОБЯЗАТЕЛЬНО
        })
        .catch((err) => {
            console.error('Ошибка сети при создании команды:', err);
            if (onError) onError(err);
        });
}


export function getTeamMembers(teamId) {
    return authFetch(`/management/get_team_members/${teamId}`, {
        method: 'GET',
        credentials: 'include',
    }).then(async res => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Ошибка получения участников команды: ${text}`);
        }

        const data = await res.json();

        // ✅ Исправление здесь
        const obj = Array.isArray(data) ? data[0] : data;

        return {
            members: (obj.members || []).map(user => ({
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                is_teamlead: user.is_teamlead,
            })),
        };
    });
}


export function handleAssignTeamLead(teamId, userId, onSuccess, onError) {
    authFetch('/management/assign_team_lead_to_team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            team_id: teamId,
            user_id: userId,
        }),
    })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Ошибка при назначении тимлида:', text);
                if (onError) onError(text);
                return;
            }

            const result = await res.json();
            if (onSuccess) onSuccess(result);
        })
        .catch((err) => {
            console.error('Ошибка сети при назначении тимлида:', err);
            if (onError) onError(err);
        });
}

export function handleRevokeTeamLead(teamId, userId, onSuccess, onError) {
    authFetch('/management/revoke_team_lead_from_team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            team_id: teamId,
            user_id: userId
        }),
    })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Ошибка при снятии тимлида:', text);
                if (onError) onError(text);
                return;
            }

            const result = await res.json();
            if (onSuccess) onSuccess(result);
        })
        .catch((err) => {
            console.error('Ошибка сети при снятии тимлида:', err);
            if (onError) onError(err);
        });
}


export function handleMoveMember(userId, fromTeamId, toTeamId, onSuccess, onError) {
    authFetch('/management/move_member_to_another_team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            user_id: userId,
            from_team_id: fromTeamId,
            to_team_id: toTeamId,
        }),
    })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Ошибка при перемещении участника:', text);
                if (onError) onError(text);
                return;
            }

            const result = await res.json();

            if (onSuccess) onSuccess(result);
        })
        .catch((err) => {
            console.error('Ошибка сети при перемещении участника:', err);
            if (onError) onError(err);
        });
}

export function handleRemoveMemberFromTeam(teamId, userId, onSuccess, onError) {
    authFetch('/management/remove_member_from_team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ team_id: teamId, user_id: userId }),
    })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Ошибка при удалении участника из команды:', text);
                if (onError) onError(text);
                return;
            }

            const result = await res.json();

            if (onSuccess) onSuccess(result);
        })
        .catch((err) => {
            console.error('Ошибка сети при удалении участника из команды:', err);
            if (onError) onError(err);
        });
}

export function handleDeleteTeam(teamId, onSuccess, onError) {
    authFetch(`/management/delete_team/${teamId}`, {
        method: 'DELETE',
        credentials: 'include',
    })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Ошибка при удалении команды:', text);
                if (onError) onError(text);
                return;
            }

            const result = await res.json();


            if (onSuccess) onSuccess(result);
        })
        .catch((err) => {
            console.error('Ошибка сети при удалении команды:', err);
            if (onError) onError(err);
        });
}



