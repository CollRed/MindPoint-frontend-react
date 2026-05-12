import "./testing-coverage-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function TestingCoverageTrigger() {
    return (
        <div className="testing-coverage-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="diagram-header-trigger">
                <div className="diagram-header-text1">В отдельных командах низкая вовлечённость в тестирование</div>
                <div className="diagram-header-text2">Участие сотрудников ниже ожидаемого относительно размера команды.</div>
            </div>
            <div className="diagram-body-trigger">
                <div className="diagram-body-text1">Почему это важно</div>
                <div className="diagram-body-text2">Это может указывать на недостаток доверия или перегруз внутри команды.</div>
            </div>
            <div className="diagram-footer-trigger">
                <div className="diagram-footer-text1">Что можно сделать</div>
                <div className="diagram-footer-text2">• Проверить коммуникацию внутри команды</div>
                <div className="diagram-footer-text3">• Напомнить о целях и принципах анонимности</div>
                <div className="diagram-footer-text4">• Поддержать регулярность участия</div>
            </div>
        </div>
    );
}


