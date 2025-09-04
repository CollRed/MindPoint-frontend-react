import './register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import leftImage from '@assets/flower-reg1.1.png';
import rightImage from '@assets/right-back.png';

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                alert('Регистрация прошла успешно!');
                navigate('/login');
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert('Ошибка регистрации. Проверь данные.');
            }
        } catch (error) {
            console.error(error);
            alert('Сервер недоступен.');
        }
    };

    return (
        <div className="register-wrapper">
            {/* Логотип */}
            <div className="logo-wrapper">
                <div className="logo">
                    MINDPOINT
                    <div className="logo-underline" />
                </div>
            </div>

            {/* Левый фон */}
            <div className="left-side">
                <img src={leftImage} alt="Цветок" />
            </div>

            {/* Форма */}
            <div
                className="register-card"
            >
                <h2>Регистрация</h2>
                <form className="form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Ф.И.О."
                        value={form.full_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Имя пользователя"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Зарегистрироваться</button>
                </form>
                <p className="login-link">
                    Уже есть аккаунт? <a href="/login">Войти</a>
                </p>
            </div>
        </div>
    );
}
