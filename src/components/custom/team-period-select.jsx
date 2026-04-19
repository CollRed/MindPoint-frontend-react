import React, { useState } from 'react';
import './team-period-select.css';
import arrowSelect from "@assets/arrow-select.svg";

const options = [
    { id: 'week', name: 'Неделя' },
    { id: 'month', name: 'Месяц' },
    { id: 'year', name: 'Год' },
];

const TeamPeriodSelect = ({ value, onChange, placeholder = 'Период' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find((option) => option.id === value);

    const handleSelect = (option) => {
        setIsOpen(false);
        onChange(option.id);
    };

    return (
        <div className="team-custom-select">
            <div className="team-custom-select-header" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption ? selectedOption.name : placeholder}
                <img
                    src={arrowSelect}
                    alt="arrow"
                    className={`team-arrow-svg ${isOpen ? "rotated" : ""}`}
                />
            </div>

            {isOpen && (
                <div className="team-custom-select-options">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="team-custom-select-option"
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

export default TeamPeriodSelect;