import { useState, useRef, useEffect } from "react";
import "./team-custom-select.css";
import arrowSelect from "@assets/arrow-select.svg";

function TeamCustomSelect({ options, placeholder = "Выбери команду", value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOption = options.find((option) => option.team.id === value);

    const handleSelect = (option) => {
        setIsOpen(false);
        onChange(option.team);
    };

    return (
        <div className="team-custom-select" ref={ref}>
            <div
                className="team-custom-select-header"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="team-custom-select-header-text">
                    {selectedOption ? selectedOption.team.name : placeholder}
                </span>

                <img
                    src={arrowSelect}
                    alt="arrow"
                    className={`team-arrow-svg ${isOpen ? "rotated" : ""}`}
                />
            </div>

            {isOpen && (
                <ul className="team-custom-select-list">
                    {options.map((option) => (
                        <li
                            key={option.team.id}
                            onClick={() => handleSelect(option)}
                            className={`team-custom-select-option ${
                                selectedOption?.team?.id === option.team.id ? "selected" : ""
                            }`}
                        >
                            {option.team.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TeamCustomSelect;