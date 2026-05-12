import "./team-risk-stress-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function EmployeeRiskDepressionTrigger() {
    return (
        <div className="employee-risk-stress-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="diagram-header-trigger">
                <div className="diagram-header-text1">В отдельных командах зафиксировано снижение эмоционального фона</div>
                <div className="diagram-header-text2">Значительная часть сотрудников демонстрирует устойчиво сниженное настроение и вовлечённость.</div>
            </div>
            <div className="diagram-body-trigger">
                <div className="diagram-body-text1">Почему это важно</div>
                <div className="diagram-body-text2">Это может повлиять на инициативность, качество работы и удержание<br/> сотрудников.</div>
            </div>
            <div className="diagram-footer-trigger">
                <div className="diagram-footer-text1">Что можно сделать</div>
                <div className="diagram-footer-text2">• Усилить поддержку и признание вклада</div>
                <div className="diagram-footer-text3">• Обратить внимание на возможности развития</div>
                <div className="diagram-footer-text4">• Поддержать чувство значимости работы</div>
            </div>
        </div>
    );
}

