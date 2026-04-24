import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../utils/authFetch';
import './test.css';
import StepHeader from "../../components/header/step-header.jsx";
import StepFooter from "../../components/footer/step-footer.jsx";
import rightImage1 from "@assets/hello-flower.svg";
import rightImageMob from "@assets/hello-flower-mob.svg";
import pychaQuest from '@assets/pycha-test.svg';
import pychaQuestTab from '@assets/test-pycha-tab.svg';
import pychaQuestMob from '@assets/test-pycha-mob.svg';
import testCloud from '@assets/test-cloud1.png';
import testCloudMob from '@assets/test-cloud-mob.png';
import testShadow from '@assets/test-shadow.svg';
import testText from '@assets/test-text.png';
import finishPycha from '@assets/finish-pycha.svg';
import finishText from '@assets/finish-text.svg';
import finishGalka from '@assets/finish-galka.svg';
import finishCloud from '@assets/finish-cloud.png';
import mood5 from "@assets/very-funny-smile.svg";
import mood4 from "@assets/light-smile.svg";
import mood3 from "@assets/moderate-smile.svg";
import mood2 from "@assets/sad-smile.svg";
import mood1 from "@assets/very-sad-smile.svg";

export default function TestingPage() {
    const [step, setStep] = useState('intro');
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selected, setSelected] = useState(null);
    const [moodPassed, setMoodPassed] = useState(null);
    const [moodValue, setMoodValue] = useState(null);
    const [moodSaving, setMoodSaving] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        authFetch('/dass9/random', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setQuestions(data))
            .catch(err => console.error('Ошибка загрузки вопросов:', err));
    }, []);

    const startTest = () => {
        if (questions.length > 0) {
            setStep('question');
        }
    };

    const handleAnswer = (answerIndex) => {
        const currentQuestion = questions[currentIndex];
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: answerIndex
        }));

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setStep('finish');
        }
    };

    useEffect(() => {
        if (step === 'finish' && Object.keys(answers).length === questions.length) {
            saveResults();
        }
        // eslint-disable-next-line
    }, [step, answers, questions]);

    const saveResults = async () => {
        const grouped = {
            depression: 0,
            stress: 0,
            anxiety: 0,
        };

        questions.forEach((q) => {
            const answerValue = Number(answers[q.id]);
            if (!isNaN(answerValue)) {
                grouped[q.type] += answerValue;
            }
        });

        try {
            const response = await authFetch('/dass9/', {
                method: 'POST',
                body: JSON.stringify(grouped)
            }, navigate);

            if (!response.ok) throw new Error('Ошибка сохранения результатов');

            const data = await response.json();
            console.log('Результат сохранён:', data);


        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        }
    };

    // Сброс выбора при смене вопроса
    useEffect(() => {
        setSelected(null);
    }, [currentIndex]);

    const moodIcons = {
        1: mood1,
        2: mood2,
        3: mood3,
        4: mood4,
        5: mood5,
    };

    useEffect(() => {
        const checkMood = async () => {
            try {
                const res = await authFetch('/mood/check', {
                    method: 'GET'
                }, navigate);

                const data = await res.json();

                setMoodPassed(data?.passed_today === true);

            } catch (e) {
                console.error('Ошибка mood check:', e);
                setMoodPassed(false);
            }
        };

        checkMood();
    }, [navigate]);

    const saveMood = async () => {
        if (moodValue === null || moodSaving) return;

        try {
            setMoodSaving(true);

            const res = await authFetch('/mood/', {
                method: 'POST',
                body: JSON.stringify({
                    score: moodValue
                })
            }, navigate);

            if (!res.ok) throw new Error('Ошибка сохранения настроения');

            console.log('Настроение сохранено');
            setMoodPassed(true);

        } catch (e) {
            console.error('Ошибка сохранения настроения:', e);
        } finally {
            setMoodSaving(false);
        }
    };


    return (

        <div className={`testing-wrapper ${
            step === 'intro' ? 'intro-bg' :
                step === 'question' ? 'question-bg' :
                    step === 'finish' ? 'finish-bg' : ''
        }`}>

            <StepHeader step={step} />
            {moodPassed === false && (
                <div className="mood-overlay">
                    <div className="mood-modal">
                        <h3>Как вы себя чувствуете сегодня?</h3>

                        <div className="mood-icons">
                            {[5,4,3,2,1].map((val) => (
                                <div
                                    key={val}
                                    className={`mood-icon ${moodValue === val ? 'active' : ''}`}
                                    onClick={() => setMoodValue(val)}
                                >
                                    <img src={moodIcons[val]} alt={`mood-${val}`} />
                                </div>
                            ))}
                        </div>

                        <button
                            className="mood-btn"
                            disabled={moodValue === null || moodSaving}
                            onClick={saveMood}
                        >
                            {moodSaving ? 'Сохранение...' : 'Выбрать'}
                        </button>
                    </div>
                </div>
            )}
            {step === 'intro' && (
                <div className="intro-container">
                    <div className="hello-flower">
                        <img src={rightImage1} alt="Цветок" />
                    </div>
                    <div className="hello-flower-mob">
                        <img src={rightImageMob} alt="Цветок" />
                    </div>
                    <div className="intro-block">
                        <h2>Перед вами тест из 9 вопросов</h2>
                        <p className="intro-desc-desktop">
                            Пожалуйста, отвечайте честно, исходя из того, что вы чувствовали со вчерашнего дня. Ваши ответы помогут системе лучше понять ваше самочувствие.
                            <br />Это займёт менее 1 минуты.
                        </p>
                        <p className="intro-desc-mobile">
                            Пожалуйста, отвечайте честно,<br />
                            исходя из того, что вы чувствовали со вчерашнего дня.<br />
                            Ваши ответы помогут системе лучше понять ваше самочувствие.<br />
                            Это займёт менее 1 минуты.
                        </p>
                        <button className="primary-btn" onClick={startTest}>
                            Пройти тестирование
                        </button>
                    </div>
                </div>
            )}

            {step === 'question' && questions.length > 0 && (
                <div className="question-container">
                    <div className="question-image-container">

                        <div className="test-cloud">
                            <img src={testCloud} alt="Тень Пучи" className="test-cloud" />
                        </div>

                        <div className="test-cloud-mob">
                            <img src={testCloudMob} alt="Тень Пучи" className="test-cloud" />
                        </div>

                        <div className="pycha-quest">
                            <img src={pychaQuest} alt="Пуча" className="pycha-quest" />
                        </div>

                        <div className="pycha-quest-tab">
                            <img src={pychaQuestTab} alt="Пуча"  />
                        </div>

                        <div className="pycha-quest-mob">
                            <img src={pychaQuestMob} alt="Пуча" className="pycha-quest" />
                        </div>

                        <div className="test-shadow">
                            <img src={testShadow} alt="Тень Пучи" className="test-shadow" />
                        </div>

                    </div>
                    <div className="question-block">
                        <div className="question-row">
                            <div className="question-header">
                                <span className="q-num">{currentIndex + 1}</span>
                                <span className="q-slash">/</span>
                                <span className="q-total">{questions.length}</span>
                            </div>
                            <div className="question-text">
                                {questions[currentIndex].text}
                            </div>
                        </div>
                        <div className="answers-block">
                            {Object.entries(questions[currentIndex].answers).map(([key, value]) => (
                                <button
                                    key={key}
                                    className={`answer-btn${selected === key ? ' selected' : ''}`}
                                    onClick={() => setSelected(key)}
                                    type="button"
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                        <button
                            className="choose-btn"
                            disabled={!selected}
                            onClick={() => {
                                handleAnswer(selected);
                                setSelected(null);
                            }}
                            type="button"
                        >
                            Выбрать
                        </button>
                    </div>
                </div>
            )}

            {step === 'finish' && (
                <div className="finish-container">
                    <div className="finish-image-container">
                        <div className="finish-cloud">
                            <img src={finishCloud} alt="Тень Пучи" className="finish-cloud" />
                        </div>

                        <div className="finish-pycha">
                            <img src={finishPycha} alt="Тень Пучи" className="finish-pycha" />
                        </div>
                    </div>

                    <div className="finish-block">
                        <img src={finishGalka} alt="Тень Пучи" className="finish-galka" />
                        <h2>Спасибо за прохождение тестирования!</h2>
                        <p>Отличная динамика, продолжай в том же духе!</p>

                        <button onClick={() => navigate('/test-completed')}>
                            На главную
                        </button>
                    </div>
                </div>
            )}

            <StepFooter step={step} />
        </div>
    );
}
