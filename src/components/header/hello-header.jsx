import React from "react";
import "./hello-header.css";
import avatar from '@assets/avatar.png';
import underlineImg from '@assets/underline-h.svg';
import { NavLink, useLocation } from "react-router-dom";


export default function HelloHeader({ title = "Тестирование" }) {
    const location = useLocation();
    const isProfilePage = location.pathname === "/profile-employee";

    return (
        <header className="testing-header">
            <div className="testing-header-title-wrap">
                <NavLink
                    to="/testing"
                    className={`testing-header-title ${isProfilePage ? "inactive-title" : ""}`}
                >
                    {title}
                </NavLink>
                {!isProfilePage && (
                    <img src={underlineImg} alt="" className="logo-underline-img2" />
                )}
            </div>
            <div className="testing-header-avatar">
                <NavLink to="/profile-employee" className="header-avatar">
                    <img src={avatar} alt="Аватар" />
                </NavLink>
            </div>
        </header>
    );
}
