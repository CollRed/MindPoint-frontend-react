import "./team-risk-stress-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function EmployeeRiskAnxietyTrigger() {
    return (
        <div className="employee-risk-stress-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="diagram-header-trigger">
                <div className="diagram-header-text1">В отдельных командах зафиксирован повышенный уровень тревожности</div>
                <div className="diagram-header-text2">Существенная часть сотрудников испытывает чувство напряжения и неопределённости.</div>
            </div>
            <div className="diagram-body-trigger">
                <div className="diagram-body-text1">Почему это важно</div>
                <div className="diagram-body-text2">Высокая тревожность снижает ощущение психологической безопасности в<br/> команде.</div>
            </div>
            <div className="diagram-footer-trigger">
                <div className="diagram-footer-text1">Что можно сделать</div>
                <div className="diagram-footer-text2">• Повысить прозрачность целей и ожиданий</div>
                <div className="diagram-footer-text3">• Чётче зафиксировать зоны ответственности</div>
                <div className="diagram-footer-text4">• Регулярно синхронизироваться с командой</div>
            </div>
        </div>
    );
}



