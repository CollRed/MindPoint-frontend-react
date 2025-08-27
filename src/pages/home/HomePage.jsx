import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h2>Home Page</h2>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
}

export default HomePage;
