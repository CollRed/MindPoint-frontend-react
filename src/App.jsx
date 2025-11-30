import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/register/register.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import HomePage from './pages/home/HomePage.jsx';
import EmployeesPage from './pages/employees/employees.jsx';
import MainLayout from './layouts/main.jsx';
import EmployeeDashboardPage from './pages/DashboardEmployees/MainEmploye.jsx';
import TestingPage from './pages/test/test.jsx';
import TestCompleted from './pages/test/test-completed.jsx';
import ProfileManager from './pages/profile/manager/profile-manager.jsx';
import ProfileEmployee from './pages/profile/employee/profile-employee.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Статистика */}
                <Route
                    path="/home"
                    element={
                        <MainLayout>
                            <HomePage />
                        </MainLayout>
                    }
                />

                {/* Сотрудники */}
                <Route
                    path="/employees"
                    element={
                        <MainLayout>
                            <EmployeesPage />
                        </MainLayout>
                    }
                />
                <Route path="/profile-manager" element={<ProfileManager /> } />
                <Route path="/profile-employee" element={<ProfileEmployee /> } />
                <Route path="/testing" element={<TestingPage />} />
                <Route path="/test-completed" element={<TestCompleted />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
