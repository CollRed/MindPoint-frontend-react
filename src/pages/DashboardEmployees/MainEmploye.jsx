import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainEmploye.css';
import { authFetch } from '../../utils/authFetch';
import { translations } from '../../utils/translations';

export default function MainEmploye() {
    const navigate = useNavigate();
    const [managerUsername, setManagerUsername] = useState('');
    const [requestStatus, setRequestStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        document.cookie = 'refresh=; Max-Age=0; path=/;';
        navigate('/login');
    };

    const handleStartTesting = async () => {
        try {
            const res = await authFetch('/dass9/check', { credentials: 'include' });
            const data = await res.json();

            if (data.passed_today) {
                navigate('/test-completed');
                return;
            }
            navigate('/testing');
        } catch (error) {
            alert('Ошибка проверки: попробуйте позже');
            console.error(error);
        }
    };

    const handleRequestManager = async () => {
        if (!managerUsername.trim()) {
            setRequestStatus('Введите логин компании!');
            return;
        }

        setLoading(true);
        setRequestStatus('');

        try {
            const res = await authFetch('/employee_settings/request_manager_by_name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ manager_username: managerUsername }),
            });

            if (res.ok) {
                setRequestStatus('Запрос отправлен! Ожидайте подтверждения от компании.');
                setManagerUsername('');
                fetchRequests();
            } else {
                const data = await res.json();
                setRequestStatus(data.message || 'Не удалось отправить запрос.');
            }
        } catch (error) {
            console.error(error);
            setRequestStatus('Сервер недоступен.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
            const res = await authFetch('/employee_settings/my_manager_requests');
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            } else {
                console.error('Ошибка получения запросов');
            }
        } catch (error) {
            console.error('Ошибка при загрузке запросов:', error);
        } finally {
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="employee-dashboard">
            <header className="dashboard-header">
                <h1>Добро пожаловать, сотрудник!</h1>
            </header>
            <div className="dashboard-content">
                <div className="requests-content">
                    <div className="company-request">
                        <input
                            type="text"
                            placeholder="Введите логин компании"
                            value={managerUsername}
                            onChange={(e) => setManagerUsername(e.target.value)}
                            disabled={loading}
                        />
                        <button onClick={handleRequestManager} disabled={loading}>
                            {loading ? 'Отправка...' : 'Отправить запрос'}
                        </button>
                        {requestStatus && <p className="request-status">{requestStatus}</p>}
                    </div>

                    <div className="requests-list">
                        <h2>Мои запросы</h2>
                        {loadingRequests ? (
                            <p>Загрузка...</p>
                        ) : requests.length > 0 ? (
                            <ul>
                                {requests.map((req) => (
                                    <li key={req.request_id}>
                                        <strong>{req.manager_username}</strong> — {translations.status[req.status] || req.status} <br />
                                        <small>Создан: {new Date(req.created_at).toLocaleString()}</small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Запросов пока нет.</p>
                        )}
                    </div>
                </div>
                <div className="dashboard">
                    <div className="dashboard-buttons">
                        <button className="testing-button" onClick={handleStartTesting}>
                            Начать тестирование
                        </button>
                        <button className="logout-button" onClick={handleLogout}>
                            Выйти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
