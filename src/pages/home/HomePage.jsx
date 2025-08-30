import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './home.css';


function HomePage() {
    const navigate = useNavigate();
    const [apiResponse, setApiResponse] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access');
        navigate('/login');
    };

    const handleApiCheck = async () => {
        try {
            const response = await fetch('/api/auth/hello', {
                method: 'GET',
                credentials: 'include', // 👈 чтобы refresh token передавался, если используется
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при запросе /api/auth/hello');
            }

            const data = await response.text(); // если возвращается просто строка
            setApiResponse(data);
        } catch (error) {
            setApiResponse('Ошибка запроса: ' + error.message);
        }
    };

    return (
        <div className="home-container">
            <h2>Home Page</h2>
            <button onClick={handleLogout}>Выйти</button>

            <hr />

            <button onClick={handleApiCheck}>Проверить API</button>
            <p>Ответ API: {apiResponse}</p>
        </div>
    );
}

export default HomePage;
