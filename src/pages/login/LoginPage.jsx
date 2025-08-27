import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = {
            username,
            password,
        };

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include', // 👈 обязательно, чтобы записать refresh_token куку
            });

            if (!response.ok) {
                throw new Error('Ошибка авторизации');
            }

            const { access } = await response.json();
            localStorage.setItem('access', access); // 👈 только access

            navigate('/home');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Вход</h2>
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
                </form>
                <p className="register-link">
                    Нет аккаунта? <a href="/register">Зарегистрироваться</a>
                </p>
            </div>
        </div>
    );
}
