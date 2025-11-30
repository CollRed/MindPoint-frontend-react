import './exit-modal.css';
import questionIcon from '@assets/question.svg';

export default function ConfirmLogoutModal({ onConfirm, onCancel }) {
    return (
        <div className="modal-overlay-exit">
            <div className="modal-window-exit">
                <div className="modal-question-icon">
                    <img src= {questionIcon} alt="?" className="question-icon-img" />
                </div>
                <p className="modal-label-exit">Вы уверены что хотите выйти из аккаунта?</p>
                <div className="modal-buttons-exit">
                    <button className="modal-confirm-exit" onClick={onConfirm}>Да</button>
                    <button className="modal-cancel-exit" onClick={onCancel}>Нет</button>
                </div>
            </div>
        </div>
    );
}
