import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from '../../layouts/main.jsx';
import './home.css';
import { authFetch } from "../../utils/authFetch.js";

function HomePage() {
    const navigate = useNavigate();
    const [apiResponse, setApiResponse] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access_token'); // <-- исправил!
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        document.cookie = 'refresh_token=; Max-Age=0; path=/;'; // но если refresh HttpOnly — чистить на бэке!
        navigate('/login');
    };

    const handleApiCheck = async () => {
        try {
            const response = await authFetch('/auth/hello', {
                method: 'GET',
                credentials: 'include',
                // headers не нужны — authFetch сам подставит Authorization!
            });

            if (!response.ok) {
                throw new Error('Ошибка при запросе /auth/hello');
            }

            const data = await response.text();
            setApiResponse(data);
        } catch (error) {
            setApiResponse('Ошибка запроса: ' + error.message);
        }
    };

    return (
        <div className="home-wrapper">
            <div className="home-container">
                <h2>Home Page</h2>
                <button onClick={handleLogout}>Выйти</button>

                <hr />

                <button onClick={handleApiCheck}>Проверить API</button>
                <p>Ответ API: {apiResponse}</p>
            </div>
        </div>
    );
}

export default HomePage;
