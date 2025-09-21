import React from "react";
import "./hello-header.css";
import avatar from '@assets/avatar.png';
import underlineImg from '@assets/underline-h.svg';

export default function HelloHeader({ title = "Тестирование" }) {
    return (
        <header className="testing-header">
            <div className="testing-header-title-wrap">
                <span className="testing-header-title">{title}</span>
                <img src={underlineImg} alt="" className="logo-underline-img2" />
            </div>
            <div className="testing-header-avatar">
                <img src={avatar} alt="Аватар" />
            </div>
        </header>
    );
}
