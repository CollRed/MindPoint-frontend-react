import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import rightImage from "@assets/flower-reg1.1.png";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const access = localStorage.getItem('access');
        const isManager = localStorage.getItem('isManager') === 'true';

        if (access) {
            if (isManager) {
                navigate('/home');
            } else {
                navigate('/employee-dashboard');
            }
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // очистим старую ошибку

        const data = { username, password };

        try {
            const response = await fetch('/api/auth/login', {
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
            localStorage.setItem('access', result.access);
            localStorage.setItem('isManager', result.isManager);

            if (result.isManager) {
                navigate('/home');
            } else {
                navigate('/employee-dashboard');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Ошибка подключения к серверу');
        }
    };

    return (
        <div className="login-page">
            <div className="login-logo">
                <span className="logo-text">MINDPOINT</span>
                <div className="logo-underline" />
            </div>

            <div className="login-card">
                <h2>Авторизация</h2>
                <form onSubmit={handleLogin}>
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
                    Нет аккаунта? <a href="/register">Зарегистрироваться</a>
                </p>
            </div>

            <img src={rightImage} alt="Цветок" className="login-flower" />
        </div>
    );
}
