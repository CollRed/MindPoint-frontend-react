import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import rightImage from "@assets/flower.svg";
import rightImageMob from "@assets/flower-mob.svg";
import rightImageTab from "@assets/login-flower-tab.svg"
import loginBg from '@assets/background-login.png';
import underlineImg from '@assets/underline.png';
import { authFetch } from "../../utils/authFetch.js";
import Footer from "../../components/footer/footer.jsx";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const access = localStorage.getItem('access_token');
        const isManager = localStorage.getItem('is_manager') === 'true';

        if (!access) return;

        const autoRedirect = async () => {
            if (isManager) {
                navigate('/home');
            } else {
                try {
                    const testRes = await authFetch('/dass9/check', { credentials: 'include' });
                    const testData = await testRes.json();

                    if (testData.passed_today) {
                        navigate('/test-completed');
                    } else {
                        navigate('/testing');
                    }
                } catch (err) {
                    console.error("Ошибка авто-чека теста", err);
                    navigate('/testing');
                }
            }
        };

        autoRedirect();
    }, [navigate]);



    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const data = { username, password };

        try {
            const response = await authFetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!response.ok) {
                setErrorMessage('Неправильный логин или пароль');
                return;
            }

            const result = await response.json();

            // Сохраняем все нужные данные
            localStorage.setItem('access_token', result.access);
            localStorage.setItem('user_id', result.userId);
            localStorage.setItem('email', result.email);
            localStorage.setItem('username', result.username);
            localStorage.setItem('fullname', result.fullname);
            localStorage.setItem('is_manager', result.is_manager);

            // Для менеджера — сразу переход
            if (result.is_manager) {
                navigate('/home');
            } else {
                // Для сотрудника — проверка прохождения теста
                const testRes = await authFetch('/dass9/check', {
                    credentials: 'include',
                });

                const testData = await testRes.json();

                if (testData.passed_today) {
                    navigate('/test-completed');
                } else {
                    navigate('/testing');
                }
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Ошибка подключения к серверу');
        }
    };



    return (
        <div className="login-page">
            <header className="login-header">
                <span className="logo-text">MINDPOINT</span>
                <img src={underlineImg} alt="" className="logo-underline-img" />
            </header>
            <div className="login-content">
                <div className="login-flower">
                    <img src={rightImage} alt="Цветок" />
                </div>
                <div className="login-flower-tab">
                    <img src={rightImageTab} alt="Цветок" />
                </div>
                <div className="login-flower-mob">
                    <img src={rightImageMob} alt="Цветок" />
                </div>

                <div className="login-card">
                    <h2>Авторизация</h2>
                    <form className="login-form" onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Войти</button>

                        {errorMessage && (
                            <p className="login-error">{errorMessage}</p>
                        )}
                    </form>

                    <p className="register-link">
                        Нету аккаунта? <a href="/register">Зарегистрироваться</a>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
