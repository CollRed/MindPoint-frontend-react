import "./chart-anxiety-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function ChartAnxietyTrigger() {
    return (
        <div className="chart-main-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="chart-header-trigger">
                <div className="chart-header-text1">Уровень тревоги в команде увеличивается</div>
                <div className="chart-header-text2">Показатели тревожности растут на протяжении нескольких периодов.</div>
            </div>
            <div className="chart-body-trigger">
                <div className="chart-body-text1">Почему это важно</div>
                <div className="chart-body-text2">Тревога часто усиливается в условиях неопределённости и частых изменений.</div>
            </div>
            <div className="chart-footer-trigger">
                <div className="chart-footer-text1">Что можно сделать</div>
                <div className="chart-footer-text2">• Снизить неопределённость в задачах и процессах</div>
                <div className="chart-footer-text3">• Чаще синхронизироваться с командой</div>
                <div className="chart-footer-text4">• Подтвердить стабильность ожиданий и поддержки</div>
            </div>
        </div>
    );
}




