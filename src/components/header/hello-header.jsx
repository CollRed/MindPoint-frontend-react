import React from "react";
import "./hello-header.css";
import avatar from '@assets/avatar.png';
import underlineImg from '@assets/underline-h.svg';
import { NavLink, useLocation } from "react-router-dom";

export default function HelloHeader({ title = "Тестирование" }) {
    const location = useLocation();
    const isProfilePage = location.pathname === "/profile-employee";
    const isTeamlead = localStorage.getItem("is_teamlead") === "true";

    return (
        <header className="testing-header">
            <div className="header-left"></div>

            <div className="testing-header-title-wrap">
                <div className="testing-header-tabs">
                    <NavLink
                        to="/testing"
                        className={`testing-header-title ${isProfilePage ? "inactive-title" : "active"}`}
                    >
                        {title}

                        {!isProfilePage && (
                            <img src={underlineImg} className="logo-underline-img2" alt="" />
                        )}
                    </NavLink>

                    {isTeamlead && (
                        <NavLink to="/home" className="testing-header-stat-link">
                            Статистика
                        </NavLink>
                    )}
                </div>
            </div>

            <div className="header-right">
                <NavLink to="/profile-employee" className="testing-header-avatar">
                    <img src={avatar} alt="" />
                </NavLink>
            </div>
        </header>
    );
}