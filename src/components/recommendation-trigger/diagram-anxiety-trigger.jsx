import "./diagram-anxiety-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function DiagramAnxietyTrigger() {
    return (
        <div className="main-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="diagram-header-trigger">
                <div className="diagram-header-text1">В команде зафиксирован повышенный уровень тревожности</div>
                <div className="diagram-header-text2">Значительная часть команды испытывает напряжение и беспокойство.</div>
            </div>
            <div className="diagram-body-trigger">
                <div className="diagram-body-text1">Почему это важно</div>
                <div className="diagram-body-text2">Высокая тревожность снижает чувство безопасности и затрудняет принятие<br/>решений.</div>
            </div>
            <div className="diagram-footer-trigger">
                <div className="diagram-footer-text1">Что можно сделать</div>
                <div className="diagram-footer-text2">• Повысить прозрачность целей и ожиданий</div>
                <div className="diagram-footer-text3">• Чётко зафиксировать приоритеты и зоны ответственности</div>
                <div className="diagram-footer-text2">• Регулярно информировать команду об изменениях</div>
            </div>
        </div>
    );
}


