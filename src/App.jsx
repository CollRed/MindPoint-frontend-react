import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/register/register.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import HomePage from './pages/home/HomePage.jsx';
import EmployeesPage from './pages/employees/employees.jsx';
import MainLayout from './layouts/main.jsx';
import TestingPage from './pages/test/test.jsx';
import TestCompleted from './pages/test/test-completed.jsx';
import ProfileManager from './pages/profile/manager/profile-manager.jsx';
import ProfileEmployee from './pages/profile/employee/profile-employee.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                {/* Логин */}
                <Route path="/login" element={<LoginPage />} />
                {/* Регистрация */}
                <Route path="/register" element={<RegisterPage />} />

                {/* Аккаунт менеджера */}
                <Route
                    path="/home"
                    element={
                        <MainLayout>
                            <HomePage />
                        </MainLayout>}/>

                {/* Аккаунт сотрудника */}
                <Route
                    path="/employees"
                    element={
                        <MainLayout>
                            <EmployeesPage />
                        </MainLayout>
                    }
                />
                {/* Профиль менеджера */}
                <Route path="/profile-manager" element={<ProfileManager /> } />
                {/* Профиль сотрудника */}
                <Route path="/profile-employee" element={<ProfileEmployee /> } />
                {/* Тестирование */}
                <Route path="/testing" element={<TestingPage />} />
                {/* Тестирование пройденно */}
                <Route path="/test-completed" element={<TestCompleted />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
