import "./diagram-depression-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function DiagramDepressionTrigger() {
    return (
        <div className="main-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="diagram-header-trigger">
                <div className="diagram-header-text1">В команде зафиксированы признаки сниженной вовлечённости и мотивации</div>
                <div className="diagram-header-text2">Значительная часть сотрудников демонстрирует устойчиво сниженное эмоциональное состояние.</div>
            </div>
            <div className="diagram-body-trigger">
                <div className="diagram-body-text1">Почему это важно</div>
                <div className="diagram-body-text2">Длительное снижение вовлечённости может влиять на инициативность, качество<br/> работы и удержание сотрудников.</div>
            </div>
            <div className="diagram-footer-trigger">
                <div className="diagram-footer-text1">Что можно сделать</div>
                <div className="diagram-footer-text2">• Усилить регулярный позитивный фидбэк</div>
                <div className="diagram-footer-text3">• Обсудить возможности</div>
            </div>
        </div>
    );
}
