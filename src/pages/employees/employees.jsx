import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import './employees.css';

const ROWS_COUNT = 10;

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        authFetch('/management/get_all_employees', {
            credentials: 'include',
        })
            .then(async res => {
                if (!res.ok) {
                    setError(res.status === 401
                        ? 'Нет доступа: авторизуйтесь как менеджер.'
                        : 'Ошибка загрузки сотрудников');
                    setEmployees([]);
                } else {
                    const data = await res.json();
                    if (isMounted) setEmployees(data);
                    setError(null);
                }
                setLoading(false);
            })
            .catch(() => {
                if (isMounted) {
                    setError('Ошибка соединения с сервером');
                    setEmployees([]);
                    setLoading(false);
                }
            });
        return () => { isMounted = false };
    }, []);

    // Дополняем до 10 строк пустыми объектами
    const displayRows = [
        ...(employees || []),
        ...Array.from({ length: ROWS_COUNT - (employees?.length || 0) }, () => ({}))
    ].slice(0, ROWS_COUNT);

    return (
        <div className="employees-bg">
            <div className="employees-block">
                <table className="employees-table">
                    <thead>
                    <tr>
                        <th>Ф.И.О.</th>
                        <th className="dashed-border">Дата последнего теста</th>
                        <th>Стресс</th>
                        <th>Тревога</th>
                        <th>Депрессия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} style={{textAlign: "center"}}>Загрузка...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5} style={{color: "red", textAlign: "center"}}>{error}</td>
                        </tr>
                    ) : (
                        displayRows.map((employee, i) => (
                            <tr key={i}>
                                <td>{employee.fullname || ''}</td>
                                <td className="dashed-border"></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
