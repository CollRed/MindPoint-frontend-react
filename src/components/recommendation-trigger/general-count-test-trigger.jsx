import "./general-count-test-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function GeneralCountTestTrigger() {
    return (
        <div className="general-count-test-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="count-header-trigger">
                <div className="count-header-text1">Уровень участия сотрудников в тестировании ниже ожидаемого</div>
                <div className="count-header-text2">Низкая вовлечённость может снижать точность общей аналитики.</div>
            </div>
            <div className="count-body-trigger">
                <div className="count-body-text1">Почему это важно</div>
                <div className="count-body-text2">При низком уровне участия данные могут не отражать реальную картину<br/> состояния организации.</div>
            </div>
            <div className="count-footer-trigger">
                <div className="count-footer-text1">Что можно сделать</div>
                <div className="count-footer-text2">• Напомнить о целях и анонимности тестирования</div>
                <div className="count-footer-text3">• Подчеркнуть ценность данных для улучшения рабочих условий</div>
                <div className="count-footer-text4">• Проверить, не перегружены ли сотрудники в текущий период</div>
            </div>
        </div>
    );
}













