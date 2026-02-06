import { useState, useRef, useEffect } from "react";
import "./custom-select.css";

function CustomSelect({ options, placeholder = "Выбери команду", onChange }) {
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
        <div className="custom-select" ref={ref}>
            <div className="custom-select-header" onClick={() => setIsOpen(!isOpen)}>
                {selected ? selected.name : placeholder}
                <span className="arrow">&#9662;</span>
            </div>
            {isOpen && (
                <ul className="custom-select-list">
                    {options.map((option) => (
                        <li
                            key={option.team.id}
                            onClick={() => handleSelect(option.team)}
                            className={`custom-select-option ${
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

export default CustomSelect;
