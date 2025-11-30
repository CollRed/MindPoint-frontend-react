import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile-manager.css';
import avatarIcon from "@assets/profile-avatar-m.svg";
import Footer from "../../../components/footer/footer.jsx";
import Header from "../../../components/header/header.jsx";
import ConfirmLogoutModal from "../../../components/modals/exit-modal.jsx";

export default function ProfileManager() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedEmail = localStorage.getItem('email');

        if (storedEmail && storedEmail !== "null") {
            setEmail(storedEmail);
        } else {
            setEmail('Почта не указана');
        }
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogoutConfirm = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    return (
        <div className="profile-page">
            <Header />
            <div className="profile-content">
                <div className="profile-header">
                    <h1 className="profile-title">Мой профиль</h1>
                    <button className="exit-button" onClick={() => setShowLogoutModal(true)}>
                        Выйти
                    </button>
                </div>
                <div className="profile-line"></div>
                <div className="profile-main">
                    <img src={avatarIcon} alt=" " className="profile-img" />
                    <h1 className="login-company">Компания {username}</h1>
                    <button className="edit-button">Редактировать профиль</button>
                    <div className="profile-line1"></div>
                </div>
                <div className="profile-info">
                    <p className="email-title">Рабочий Email</p>
                    <p className="email-man">{email}</p>
                </div>
            </div>
            <Footer />
            {showLogoutModal && (
                <ConfirmLogoutModal
                    onConfirm={handleLogoutConfirm}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}
        </div>
    );
}
