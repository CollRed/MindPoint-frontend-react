import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile-employee.css';
import avatarIcon from "@assets/profile-avatar-m.svg";
import Footer from "../../../components/footer/footer.jsx";
import HelloHeader from "../../../components/header/hello-header.jsx";
import {authFetch} from "../../../utils/authFetch.js";
import { translations } from "../../../utils/translations.js";
import RequestModal from "../../../components/modals/RMProfileEmployee.jsx";
import ConfirmLogoutModal from "../../../components/modals/exit-modal.jsx";
import Pagination from "../../../components/pagination/pagination.jsx";



export default function ProfileEmployee() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // позже обновим по количеству заявок
    const pageSize = 3;

    const paginatedRequests = requests.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    useEffect(() => {
        authFetch("/employee_settings/my_manager_requests", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setRequests(data);
                setTotalPages(Math.ceil(data.length / pageSize));
            })
            .catch((err) => console.error("Ошибка загрузки заявок:", err));
    }, []);


    useEffect(() => {
        const stored = localStorage.getItem('fullname');
        const storedEmail = localStorage.getItem('email');
        const storedUsername = localStorage.getItem('username');

        if (stored) setFullname(stored);
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail && storedEmail !== "null") {
            setEmail(storedEmail);
        } else {
            setEmail('Почта не указана');
        }
    }, []);

    const handleLogoutConfirm = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const sendRequestToManager = (manager_username) => {
        authFetch("/employee_settings/request_manager_by_name", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
            body: JSON.stringify({ manager_username }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Ошибка при отправке");
                return res.json();
            })
            .then(() => {
                alert("Заявка отправлена");
                setShowRequestModal(false);
            })
            .catch((err) => {
                console.error(err);
                alert("Не удалось отправить заявку");
            });
    };

    return (
        <div className="profile-page-employee">
            <HelloHeader />
            <div className="profile-content-employee">
                <div className="profile-header-employee">
                    <h1 className="profile-title-employee">Мой профиль</h1>
                    <button className="exit-button" onClick={() => setShowLogoutModal(true)}>
                        Выйти
                    </button>
                </div>
                <div className="profile-line-employee"></div>
                <div className="profile-main-employee">
                    <img src={avatarIcon} alt=" " className="profile-img" />
                    <h1 className="login-employee">{fullname}</h1>
                    <button className="edit-button-employee">Редактировать профиль</button>
                    <p className="work">Сотрудник</p>
                    <div className="profile-line1-employee"></div>
                </div>
                <div className="profile-info-employee">
                    <div className="profile-info-email">
                        <p className="email-title-employee">Рабочий Email</p>
                        <p className="email-employee">{email}</p>
                    </div>
                    <div className="profile-info-login">
                        <p className="login-title-employee">Логин</p>
                        <p className="username-employee">{username}</p>
                    </div>
                </div>
                <div className="profile-invite">
                    <h1 className="my-invite">Мои заявки</h1>
                    <div className="profile-line-employee3"></div>
                    <div className="profile-invite-container">
                        <div className="profile-container">
                            <p className="profile-container-date">Дата</p>
                            <p className="profile-container-company">Компания</p>
                            <p className="profile-container-status">Статус</p>
                        </div>
                        <div className="profile-status-list">
                            {[...Array(3)].map((_, index) => {
                                const req = paginatedRequests[index];
                                return (
                                    <div key={index} className="profile-status">
                                        <p className="profile-status-date">
                                            {req ? new Date(req.created_at).toLocaleDateString("ru-RU") : ''}
                                        </p>
                                        <p className="profile-status-company">
                                            {req ? req.manager_username : ''}
                                        </p>
                                        <p className={`profile-status-status ${req?.status || ''}`}>
                                            {req ? translations.status[req.status] || req.status : ''}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="button-footer">
                    <div className="pagination-pe">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                    <button className="button-send" onClick={() => setShowRequestModal(true)}>
                        Отправить заявку
                    </button>
                </div>
            </div>
            <Footer />
            {showRequestModal && (
                <RequestModal
                    onClose={() => setShowRequestModal(false)}
                    onSubmit={sendRequestToManager}
                />
            )}
            {showLogoutModal && (
                <ConfirmLogoutModal
                    onConfirm={handleLogoutConfirm}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}
        </div>
    );
}