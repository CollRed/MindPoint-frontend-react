import { useState, useRef, useEffect } from "react";
import "./team-custom-select.css";
import arrowSelect from "@assets/arrow-select.svg";

function TeamCustomSelect({ options, placeholder = "Выбери команду", onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
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

    const handleSelect = (option) => {
        setSelected(option);
        setIsOpen(false);
        onChange(option);
    };

    return (
        <div className="team-custom-select" ref={ref}>
            <div className="team-custom-select-header" onClick={() => setIsOpen(!isOpen)}>
    <span className="team-custom-select-header-text">
        {selected ? selected.name : placeholder}
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
                            onClick={() => handleSelect(option.team)}
                            className={`team-custom-select-option ${
                                selected?.id === option.team.id ? "selected" : ""
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
