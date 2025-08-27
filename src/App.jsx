import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/register/register.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import HomePage from './pages/home/HomePage.jsx';

function App() {
    const token = localStorage.getItem('access');

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={token ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
