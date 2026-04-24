import "./chart-stress-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function ChartStressTrigger() {
    return (
        <div className="chart-main-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="chart-header-trigger">
                <div className="chart-header-text1">Наблюдается рост уровня стресса в команде</div>
                <div className="chart-header-text2">Показатели стресса увеличиваются на протяжении нескольких периодов.</div>
            </div>
            <div className="chart-body-trigger">
                <div className="chart-body-text1">Почему это важно</div>
                <div className="chart-body-text2">Рост стресса часто связан с изменениями в процессах,<br/> дедлайнах или структуре работы.</div>
            </div>
            <div className="chart-footer-trigger">
                <div className="chart-footer-text1">Что можно сделать</div>
                <div className="chart-footer-text2">• Проанализировать недавние изменения в работе команды</div>
                <div className="chart-footer-text3">• Провести ретроспективу с фокусом на нагрузку</div>
                <div className="chart-footer-text4">• Временно снизить давление на сроки, если это возможно</div>
            </div>
        </div>
    );
}






