import './test-footer.css';

export default function TestFooter() {
    return (
        <footer className="test-app-footer">
            <div className="test-footer-gradient"></div>
            <div className="test-footer-links">
                <span>Поддержка</span>
                <span>Документы</span>
                <span>Конфиденциальность</span>
                <span>Прочее</span>
            </div>
        </footer>
    );
}
