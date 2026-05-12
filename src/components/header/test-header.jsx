import React from "react";
import "./test-header.css";
import avatar from "@assets/avatar.png";
import underlineImg from "@assets/underline-h.svg";
import { NavLink } from "react-router-dom";

export default function TestHeader({ title = "Тестирование" }) {
    const isTeamlead = localStorage.getItem("is_teamlead") === "true";

    return (
        <header className="test-header">
            <div className="test-header-title-wrap">
                <div className="test-header-tabs">
                    <span className="test-header-title active">
                        {title}
                    </span>

                    {isTeamlead && (
                        <NavLink to="/home" className="test-header-stat-link">
                            Статистика
                        </NavLink>
                    )}
                </div>

                <img src={underlineImg} alt="" className="logo-underline-img3" />
            </div>

            <div className="test-header-avatar">
                <NavLink to="/profile-employee" className="header-avatar">
                    <img src={avatar} alt="Аватар" />
                </NavLink>
            </div>
        </header>
    );
}