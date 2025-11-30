import './header.css';
import avatar from '@assets/avatar.png';
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import underlineImg from '@assets/logo-underline.png';

export default function Header() {
    const location = useLocation();
    const [underlineStyle, setUnderlineStyle] = useState({});
    const tabRefs = {
        '/home': useRef(null),
        '/employees': useRef(null),
    };

    // 👇 ВОТ ЭТО: добавляем переменную!
    const hideUnderline = location.pathname === '/profile-manager';

    useEffect(() => {
        const currentPath = location.pathname;
        const activeTab = tabRefs[currentPath]?.current;

        if (activeTab && !hideUnderline) {
            const { offsetLeft, offsetWidth } = activeTab;
            setUnderlineStyle({
                left: offsetLeft,
                width: offsetWidth,
            });
        }
    }, [location.pathname, hideUnderline]);

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-tabs">
                    <NavLink to="/home" ref={tabRefs['/home']} className="tab">
                        Статистика
                    </NavLink>
                    <NavLink to="/employees" ref={tabRefs['/employees']} className="tab">
                        Команды
                    </NavLink>

                    {/* 👇 Проверка перед отрисовкой линии */}
                    {!hideUnderline && (
                        <img
                            src={underlineImg}
                            alt=""
                            className="logo-underline-img1"
                            style={underlineStyle}
                        />
                    )}
                </div>

                <NavLink to="/profile-manager" className="header-avatar">
                    <img src={avatar} alt="Аватар" />
                </NavLink>
            </div>
        </header>
    );
}
