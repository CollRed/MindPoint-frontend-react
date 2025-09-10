import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../utils/authFetch';
import './test.css';

export default function TestingPage() {
    const [step, setStep] = useState('intro'); // 'intro' | 'question' | 'finish'
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        authFetch('/dass9/random', {
            credentials: 'include' // если backend проверяет refresh_token
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
            saveResults(); // 👈 сохраняем результаты
        }
    };

    const saveResults = async () => {
        const grouped = {
            depression: 0,
            stress: 0,
            anxiety: 0
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

    return (
        <div className="testing-wrapper">
            {step === 'intro' && (
                <div className="intro-block">
                    <h2>Перед вами тест из 9 вопросов</h2>
                    <p>
                        Отвечайте честно, исходя из того, что вы чувствовали со вчерашнего дня.
                        Это займет менее 1 минуты.
                    </p>
                    <button className="primary-btn" onClick={startTest}>
                        Пройти тестирование
                    </button>
                </div>
            )}

            {step === 'question' && questions.length > 0 && (
                <div className="question-block">
                    <div className="question-header">
                        Вопрос {currentIndex + 1} / {questions.length}
                    </div>
                    <div className="question-text">{questions[currentIndex].text}</div>
                    <div className="answers-block">
                        {Object.entries(questions[currentIndex].answers).map(([key, value]) => (
                            <button
                                key={key}
                                className="answer-btn"
                                onClick={() => handleAnswer(key)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'finish' && (
                <div className="finish-block">
                    <h2>Спасибо за прохождение тестирования!</h2>
                    <p>Отличная динамика, продолжай в том же духе!</p>
                </div>
            )}
        </div>
    );
}
