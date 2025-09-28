import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import rightImage from "@assets/flower.svg";
import rightImageMob from "@assets/flower-mob.svg";
import loginBg from '@assets/background-login.png';
import underlineImg from '@assets/underline.png';
import { authFetch } from "../../utils/authFetch.js";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const access = localStorage.getItem('access_token');
        const isManager = localStorage.getItem('isManager') === 'true';

        if (access) {
            if (isManager) {
                navigate('/home');
            } else {
                navigate('/employee-dashboard');
            }
        }
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
            localStorage.setItem('access_token', result.access); // <-- ВАЖНО!
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
                <img src={underlineImg} alt="" className="logo-underline-img" />
            </div>
            <div className="login-flower">
                <img src={rightImage} alt="Цветок" />
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
    );
}
