import React, { useState } from 'react';
import './period-select.css';

const PeriodSelect = ({ onChange, placeholder = 'Период' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const options = [
        { id: 'week', name: 'Неделя' },
        { id: 'month', name: 'Месяц' },
        { id: 'year', name: 'Год' },
    ];

    const handleSelect = (option) => {
        setSelected(option);
        setIsOpen(false);
        onChange(option.id); // отдаём наружу
    };

    return (
        <div className="custom-select">
            <div className="custom-select-header" onClick={() => setIsOpen(!isOpen)}>
                {selected ? selected.name : placeholder}
                <span className="arrow">&#9662;</span>
            </div>
            {isOpen && (
                <div className="custom-select-options">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="custom-select-option"
                            onClick={() => handleSelect(option)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PeriodSelect;
