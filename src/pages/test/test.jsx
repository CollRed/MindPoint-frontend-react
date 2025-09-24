import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../utils/authFetch';
import './test.css';
import StepHeader from "../../components/header/step-header.jsx";
import Footer from "../../components/footer/footer";
import rightImage1 from "@assets/hello-flower.svg";
import pychaQuest from '@assets/pycha-quest.svg';
import testCloud from '@assets/test-cloud.svg';
import testShadow from '@assets/test-shadow.svg';
import testText from '@assets/test-text.svg';
import finishPycha from '@assets/finish-pycha.svg';
import finishText from '@assets/finish-text.svg';
import finishGalka from '@assets/finish-galka.svg';
import finishCloud from '@assets/finish-cloud.svg';

export default function TestingPage() {
    const [step, setStep] = useState('intro');
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selected, setSelected] = useState(null);
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

            setTimeout(() => {
                navigate('/employee-dashboard');
            }, 2000);

        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        }
    };

    // Сброс выбора при смене вопроса
    useEffect(() => {
        setSelected(null);
    }, [currentIndex]);

    return (
        <div className={`testing-wrapper ${
            step === 'intro' ? 'intro-bg' : step === 'question' ? 'question-bg' : ''
        }`}>

            {/* Цветок только на intro */}
            {step === 'intro' && (
                <img src={rightImage1} alt="Цветок" className="hello-flower" />
            )}

            {step === 'question' && (
                <img src={pychaQuest} alt="Пуча" className="pycha-quest" />
            )}
            {step === 'question' && (
                <img src={testCloud} alt="Облако" className="test-cloud" />

            )}
            {step === 'question' && (
                <img src={testText} alt="Текст" className="test-text" />

            )}
            {step === 'question' && (
                <img src={testShadow} alt="Тень Пучи" className="test-shadow" />
            )}

            {step === 'finish' && (
                <img src={finishPycha} alt="Пуча" className="finish-pycha" />
            )}
            {step === 'finish' && (
                <img src={finishText} alt="Облако" className="finish-text" />

            )}
            {step === 'finish' && (
                <img src={finishGalka} alt="Тень Пучи" className="finish-galka" />
            )}

            {step === 'finish' && (
                <img src={finishCloud} alt="Тень Пучи" className="finish-cloud" />
            )}

            <StepHeader step={step} />

            {step === 'intro' && (
                <div className="intro-block">
                    <h2>Перед вами тест из 9 вопросов</h2>
                    <p>
                        Пожалуйста, отвечайте честно, исходя из того, что вы чувствовали со вчерашнего дня. Ваши ответы помогут системе лучше понять ваше самочувствие.
                        <br />Это займёт менее 1 минуты.
                    </p>
                    <button className="primary-btn" onClick={startTest}>
                        Пройти тестирование
                    </button>
                </div>
            )}

            {step === 'question' && questions.length > 0 && (
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
            )}

            {step === 'finish' && (
                <div className="finish-bg">
                    <div className="finish-block">
                        <h2>Спасибо за прохождение тестирования!</h2>
                        <p>Отличная динамика, продолжай в том же духе!</p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
