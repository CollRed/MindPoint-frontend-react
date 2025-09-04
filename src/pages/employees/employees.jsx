import './employees.css';
import { useNavigate } from 'react-router-dom';

export default function EmployeesPage() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/testing');
    };

    return (
        <div className="employees-wrapper">
            <div className="employees-container">
                <h2>Тестирование</h2>
                <button onClick={handleNavigate}>Перейти к тестированию</button>
            </div>
        </div>
    );
}
