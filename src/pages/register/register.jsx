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
        <div className="register-bg">
            <div className="ellipse ellipse-left"></div>
            <div className="ellipse ellipse-right"></div>

            <header className="register-header">
                <div className="register-logo">
                    MINDPOINT
                    <div className="register-underline" />
                </div>
            </header>

            <div className="register-flower">
                <img src={leftImage} alt="Цветок" />
            </div>

            <div className="register-card">
                <h2 className="register-title">Регистрация</h2>
                <form className="register-form" onSubmit={handleRegister}>
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
                    <button type="submit" className="register-btn">
                        <span className="register-btn-text">Зарегистрироваться</span>
                    </button>
                </form>
                <p className="register-link">
                    У вас уже есть аккаунт? <a href="/login">Войти</a>
                </p>
            </div>
        </div>
    );
}
