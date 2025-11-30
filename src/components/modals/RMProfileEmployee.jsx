import { useState } from "react";
import "./RMProfileEmployee.css";
import closeIcon from "@assets/Close.svg"
import questionIcon from "@assets/question.svg";

export default function RequestModal({ onClose, onSubmit }) {
    const [username, setUsername] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const handleAddClick = () => {
        if (username.trim()) {
            setShowConfirm(true);
        }
    };

    const handleConfirm = () => {
        onSubmit(username.trim());
        setShowConfirm(false);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className={`modal-window ${showConfirm ? 'confirm' : 'request'}`}>
                {showConfirm ? (
                    <>
                        <div className="modal-question-icon">
                            <img src={questionIcon} alt="?" className="question-icon-img" />
                        </div>

                        <p className="modal-label-center">
                            Вы уверены что хотите отправить заявку в компанию?
                        </p>
                        <div className="modal-buttons-pe">
                            <button className="modal-confirm-pe" onClick={handleConfirm}>Да</button>
                            <button className="modal-cancel-pe" onClick={() => setShowConfirm(false)}>Нет</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="modal-header-pe">
                            <h2>Отправить заявку</h2>
                            <button className="modal-close-pe" onClick={onClose}>
                                <img src={closeIcon} alt="Закрыть" className="close-icon" />
                            </button>
                            <div className="modal-line-pe"></div>
                        </div>
                        <div className="modal-body-pe">
                            <p className="modal-label-pe">Укажите логин компании</p>
                            <input
                                className="modal-input-pe"
                                placeholder="Введите логин"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <button className="modal-submit-pe" onClick={handleAddClick}>
                                Добавить
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
