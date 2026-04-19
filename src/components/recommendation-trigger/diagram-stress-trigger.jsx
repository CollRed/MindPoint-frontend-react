import "./diagram-stress-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function DiagramStressTrigger() {
    return (
        <div className="main-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="diagram-header-trigger">
                <div className="diagram-header-text1">В команде зафиксирован повышенный уровень стресса</div>
                <div className="diagram-header-text2">Значительная часть сотрудников испытывает повышенную стрессовую нагрузку.</div>
            </div>
            <div className="diagram-body-trigger">
                <div className="diagram-body-text1">Почему это важно</div>
                <div className="diagram-body-text2">Длительный высокий стресс напрямую влияет на продуктивность,<br/> качество решений и риск выгорания.</div>
            </div>
            <div className="diagram-footer-trigger">
                <div className="diagram-footer-text1">Что можно сделать</div>
                <div className="diagram-footer-text2">• Проверить текущую рабочую нагрузку и приоритеты</div>
                <div className="diagram-footer-text3">• Пересмотреть сроки и распределение задач</div>
                <div className="diagram-footer-text4">• Обсудить с командой источники напряжения</div>
            </div>
        </div>
    );
}