import './register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import leftImageDesk from '@assets/reg-flower.svg';
import leftImageMob from '@assets/reg-flower-mob.svg';
import leftImageTab from '@assets/register-flower-tab.svg';
import regUnderlineImg from '@assets/underline-h.svg';
import Footer from "../../components/footer/footer.jsx";

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
    });

    const [registerType, setRegisterType] = useState('employee'); // employee | company
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Добавляем флаг isManager в тело запроса
        const payload = {
            ...form,
            is_manager: registerType === 'company',
        };

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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
            <header className="register-header">
                <span className="register-logo">MINDPOINT</span>
                <img src={regUnderlineImg} alt="" className="reg-logo-underline" />
            </header>

            <div className="register-content">
                <div className="register-flower">
                    <img src={leftImageDesk} alt="Цветок" />
                </div>
                <div className="register-flower-tab">
                    <img src={leftImageTab} alt="Цветок" />
                </div>
                <div className="register-flower-mob">
                    <img src={leftImageMob} alt="Цветок" />
                </div>

                <div className="register-card">
                    <h2 className="register-title">Регистрация</h2>

                    {/* Переключатель типа регистрации */}
                    <div className="register-switch">
                        <button
                            type="button"
                            className={registerType === 'employee' ? 'active' : ''}
                            onClick={() => setRegisterType('employee')}
                        >
                            Сотрудник
                        </button>
                        <button
                            type="button"
                            className={registerType === 'company' ? 'active' : ''}
                            onClick={() => setRegisterType('company')}
                        >
                            Компания
                        </button>
                    </div>

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
                            placeholder={
                                registerType === 'company'
                                    ? 'Введите название компании'
                                    : 'Имя пользователя'
                            }
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

                    <p className="login-link">
                        У вас уже есть аккаунт? <a href="/login">Войти</a>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
