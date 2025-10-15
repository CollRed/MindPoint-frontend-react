import './test-completed.css';
import HelloHeader from "../../components/header/hello-header.jsx";

import completedFlowerDesk from "@assets/hello-flower.svg";
import completedFlowerTab from "@assets/hello-flower-tab.svg";
import completedFlowerMob from "@assets/hello-flower-mob.svg";
import completedGalkaDesk from "@assets/finish-galka.svg";
import completedGalkaMob from "@assets/finish-galka-mob.svg";
import Footer from "../../components/footer/footer.jsx";

export default function TestCompleted() {
    return (
        <div className="test-completed-page">
            <HelloHeader title="Тестирование" />
            <div className="test-completed-content">
                <div className="completed-flower-desk">
                    <img src={completedFlowerDesk} alt="Цветок" />
                </div>
                <div className="completed-flower-tablet">
                    <img src={completedFlowerTab} alt="Цветок" />
                </div>
                <div className="completed-flower-mobile">
                    <img src={completedFlowerMob} alt="Цветок" />
                </div>
                <div className="test-completed-block">
                    <div className="completed-galka-desk">
                        <img src={completedGalkaDesk} alt="Галка" />
                    </div>
                    <div className="completed-galka-mob">
                        <img src={completedGalkaMob} alt="Галка" />
                    </div>
                    <h2>Сегодня вы уже прошли тестирование!</h2>
                    <p>
                        Повторное прохождение будет доступно завтра.
                        Регулярное выполнение поможет вам объективно отслеживать результаты.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
