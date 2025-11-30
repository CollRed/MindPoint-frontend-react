import React from "react";
import "./test-header.css";
import avatar from '@assets/avatar.png';
import underlineImg from '@assets/underline-h.svg';
import {NavLink} from "react-router-dom";

export default function TestHeader({ title = "Тестирование" }) {
    return (
        <header className="test-header">
            <div className="test-header-title-wrap">
                <span className="test-header-title">{title}</span>
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