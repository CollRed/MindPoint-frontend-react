import "./employee-risk-stress-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function EmployeeRiskStressTrigger() {
    return (
        <div className="employee-risk-stress-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="diagram-header-trigger">
                <div className="diagram-header-text1">В отдельных командах зафиксирован повышенный уровень стресса</div>
                <div className="diagram-header-text2">Доля сотрудников с высокой стрессовой нагрузкой превышает критическое значение.</div>
            </div>
            <div className="diagram-body-trigger">
                <div className="diagram-body-text1">Почему это важно</div>
                <div className="diagram-body-text2">Локально высокий стресс может привести к выгоранию и снижению качества<br/> работы в конкретных командах.</div>
            </div>
            <div className="diagram-footer-trigger">
                <div className="diagram-footer-text1">Что можно сделать</div>
                <div className="diagram-footer-text2">• Сфокусировать внимание на этих командах</div>
                <div className="diagram-footer-text3">• Проанализировать нагрузку и дедлайны</div>
                <div className="diagram-footer-text4">• Рассмотреть перераспределение задач или ресурсов</div>
            </div>
        </div>
    );
}




