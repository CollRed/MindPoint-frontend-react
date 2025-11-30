import { useEffect } from "react";
import "./notification.css";
import errorIcon from '@assets/error-icon.svg';
import successIcon from '@assets/success-icon.svg';


export default function Notification({ type, message, onClose }) {
    useEffect(() => {
        const timeout = setTimeout(onClose, 3000); // Автозакрытие через 3 сек
        return () => clearTimeout(timeout);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <img
                src={type === "success" ? successIcon : errorIcon}
                alt={type === "success" ? "Успешно" : "Ошибка"}
                className="notification-icon"
            />
            <span>{message}</span>
        </div>
    );
}
