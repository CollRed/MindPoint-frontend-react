import { useNavigate } from 'react-router-dom';
import './MainEmploye.css';
import { authFetch } from '../../utils/authFetch';

export default function MainEmploye() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        document.cookie = 'refresh=; Max-Age=0; path=/;';
        navigate('/login');
    };

    const handleStartTesting = async () => {
        try {
            const res = await authFetch('/dass9/check', { credentials: 'include' });
            const data = await res.json(); // <-- теперь жди JSON!

            if (data.passed_today) {
                alert('Вы уже проходили тест сегодня!');
                return;
            }
            navigate('/testing');
        } catch (error) {
            alert('Ошибка проверки: попробуйте позже');
            console.error(error);
        }
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
