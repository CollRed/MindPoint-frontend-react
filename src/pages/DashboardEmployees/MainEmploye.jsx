import { useNavigate } from 'react-router-dom';
import './MainEmploye.css';

export default function MainEmploye() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // ✅ полностью очищаем localStorage
        document.cookie = 'refresh=; Max-Age=0; path=/;'; // ✅ стираем refresh-токен (если он в куках)
        navigate('/login');
    };

    const handleStartTesting = () => {
        navigate('/testing');
    };

    return (
        <div className="employee-dashboard">
            <header className="dashboard-header">
                <h1>Добро пожаловать, сотрудник!</h1>
            </header>

            <main className="dashboard-content">
                <p>Здесь будет ваша панель управления.</p>

                <div className="dashboard-buttons">
                    <button className="testing-button" onClick={handleStartTesting}>
                        Начать тестирование
                    </button>

                    <button className="logout-button" onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
            </main>
        </div>
    );
}
