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

    useEffect(() => {
        const currentPath = location.pathname;
        const activeTab = tabRefs[currentPath]?.current;

        if (activeTab) {
            const { offsetLeft, offsetWidth } = activeTab;
            setUnderlineStyle({
                left: offsetLeft,
                width: offsetWidth,
            });
        }
    }, [location.pathname]);

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-tabs">
                    <NavLink
                        to="/home"
                        ref={tabRefs['/home']}
                        className="tab"
                    >
                        Статистика
                    </NavLink>
                    <NavLink
                        to="/employees"
                        ref={tabRefs['/employees']}
                        className="tab"
                    >
                        Сотрудники
                    </NavLink>

                    {/* Градиентная линия */}
                    <img
                        src={underlineImg}
                        alt=""
                        className="logo-underline-img1"
                        style={underlineStyle}
                    />
                </div>

                <div className="header-avatar">
                    <img src={avatar} alt="Аватар" />
                </div>
            </div>
        </header>
    );
}
