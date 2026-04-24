import "./count-test-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function CountTestTrigger() {
    return (
        <div className="count-test-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="count-header-trigger">
                <div className="count-header-text1">Снижается участие команды в регулярном тестировании</div>
                <div className="count-header-text2">Уровень прохождения DASS-9 ниже ожидаемого для выбранного периода.</div>
            </div>
            <div className="count-body-trigger">
                <div className="count-body-text1">Почему это важно</div>
                <div className="count-body-text2">Низкая вовлечённость может снижать достоверность аналитики и указывать на<br/> отсутствие доверия или ценности инструмента.</div>
            </div>
            <div className="count-footer-trigger">
                <div className="count-footer-text1">Что можно сделать</div>
                <div className="count-footer-text2">• Напомнить команде о цели и анонимности тестирования</div>
                <div className="count-footer-text3">• Подчеркнуть, что результаты используются на уровне команды, а не отдельных<br/> сотрудников</div>
                <div className="count-footer-text4">• Проверить, не перегружен ли текущий рабочий ритм</div>
            </div>
        </div>
    );
}








