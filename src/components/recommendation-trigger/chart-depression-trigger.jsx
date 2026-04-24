import "./chart-depression-trigger.css";
import bigAlert from "@assets/big-alert.svg";

export default function ChartDepressionTrigger() {
    return (
        <div className="chart-main-trigger">
            <img src={bigAlert} alt="alert" className="big-alert"/>
            <div className="chart-header-trigger">
                <div className="chart-header-text1">Сниженное эмоциональное состояние сохраняется длительное время</div>
                <div className="chart-header-text2">Показатели не возвращаются к нормальному уровню на протяжении нескольких периодов.</div>
            </div>
            <div className="chart-body-trigger">
                <div className="chart-body-text1">Почему это важно</div>
                <div className="chart-body-text2">Это может быть признаком хронической усталости или отсутствия<br/> восстановления.</div>
            </div>
            <div className="chart-footer-trigger">
                <div className="chart-footer-text1">Что можно сделать</div>
                <div className="chart-footer-text2">• Проверить баланс нагрузки и восстановления</div>
                <div className="chart-footer-text3">• Обсудить возможности гибкости в работе</div>
                <div className="chart-footer-text4">• Напомнить о доступных ресурсах поддержки</div>
            </div>
        </div>
    );
}
