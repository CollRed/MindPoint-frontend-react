import React, { useState, useRef, useEffect, useMemo } from "react";
import "./custom-select.css";
import arrowSelect from "@assets/arrow-select.svg";

function CustomSelect({
                          options = [],
                          placeholder = "Выбери команду",
                          selectedValues = [],
                          onChange,
                      }) {
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

    const normalizedOptions = useMemo(() => {
        return options.map((option) => {
            const team = option.team ? option.team : option;

            return {
                id: team.id,
                name: team.name,
            };
        });
    }, [options]);

    const allIds = normalizedOptions.map((option) => option.id);

    // [] = режим "Все"
    const isAllSelected = selectedValues.length === 0;

    const selectedTeams = normalizedOptions.filter((team) =>
        selectedValues.includes(team.id)
    );

    const headerText =
        isAllSelected
            ? "Все"
            : selectedTeams.length === 0
                ? placeholder
                : selectedTeams.length === 1
                    ? selectedTeams[0].name
                    : `Выбрано команд: ${selectedTeams.length}`;

    const toggleAll = () => {
        // включаем режим "Все"
        onChange([]);
    };

    const toggleOption = (teamId) => {
        // если было выбрано "Все", то при клике на конкретную команду
        // убираем "Все" и выбираем только эту команду
        if (isAllSelected) {
            onChange([teamId]);
            return;
        }

        const isSelected = selectedValues.includes(teamId);

        if (isSelected) {
            const updatedValues = selectedValues.filter((id) => id !== teamId);

            // если сняли последнюю конкретную команду — возвращаем "Все"
            onChange(updatedValues.length > 0 ? updatedValues : []);
        } else {
            onChange([...selectedValues, teamId]);
        }
    };

    return (
        <div className="custom-select" ref={ref}>
            <div
                className="custom-select-header"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className="custom-select-header-text">
                    {headerText}
                </span>

                <img
                    src={arrowSelect}
                    alt="arrow"
                    className={`team-arrow-svg ${isOpen ? "rotated" : ""}`}
                />
            </div>

            {isOpen && (
                <ul className="custom-select-list">
                    <li
                        onClick={toggleAll}
                        className={`custom-select-option ${isAllSelected ? "selected" : ""}`}
                    >
                        <span className="custom-select-option-text">
                            Все
                        </span>

                        <span className={`custom-select-check ${isAllSelected ? "checked" : ""}`}>
                            {isAllSelected && "✓"}
                        </span>
                    </li>

                    {normalizedOptions.map((option) => {
                        const isSelected = selectedValues.includes(option.id);

                        return (
                            <li
                                key={option.id}
                                onClick={() => toggleOption(option.id)}
                                className={`custom-select-option ${isSelected ? "selected" : ""}`}
                            >
                                <span className="custom-select-option-text">
                                    {option.name}
                                </span>

                                <span className={`custom-select-check ${isSelected ? "checked" : ""}`}>
                                    {isSelected && "✓"}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default CustomSelect;