import './header.css';
import avatar from '@assets/avatar.png';
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import underlineImg from '@assets/logo-underline.png';

export default function Header() {
    const location = useLocation();
    const [underlineStyle, setUnderlineStyle] = useState({});

    const homeTabRef = useRef(null);
    const testingTabRef = useRef(null);
    const employeesTabRef = useRef(null);
    const isManager = localStorage.getItem('is_manager') === 'true';
    const isTeamlead = localStorage.getItem('is_teamlead') === 'true';

    const tabRefs = {
        ...(isTeamlead && { '/testing': testingTabRef }),
        '/home': homeTabRef,
        ...(isManager && { '/employees': employeesTabRef }),
    };

    const profilePath = isManager
        ? "/profile-manager"
        : "/profile-employee";

    const hideUnderline = location.pathname === '/profile-manager';

    useEffect(() => {
        const currentPath = location.pathname;
        const activeTab = tabRefs[currentPath]?.current;

        if (activeTab && !hideUnderline) {
            const { offsetLeft, offsetWidth } = activeTab;
            setUnderlineStyle({
                left: `${offsetLeft}px`,
                width: `${offsetWidth}px`,
            });
        }
    }, [location.pathname, hideUnderline]);

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-tabs">
                    {isTeamlead && (
                        <NavLink to="/testing" ref={testingTabRef} className="tab">
                            Тестирование
                        </NavLink>
                    )}

                    <NavLink to="/home" ref={homeTabRef} className="tab">
                        Статистика
                    </NavLink>

                    {isManager && (
                        <NavLink to="/employees" ref={employeesTabRef} className="tab">
                            Команды
                        </NavLink>
                    )}

                    {!hideUnderline && (
                        <img
                            src={underlineImg}
                            alt=""
                            className="logo-underline-img1"
                            style={underlineStyle}
                        />
                    )}
                </div>

                <NavLink to={profilePath} className="header-avatar">
                    <img src={avatar} alt="" />
                </NavLink>
            </div>
        </header>
    );
}
