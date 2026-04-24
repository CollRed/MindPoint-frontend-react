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

    const toggleOption = (teamId) => {
        const isSelected = selectedValues.includes(teamId);

        if (isSelected) {
            onChange(selectedValues.filter((id) => id !== teamId));
        } else {
            onChange([...selectedValues, teamId]);
        }
    };

    const selectedTeams = normalizedOptions.filter((team) =>
        selectedValues.includes(team.id)
    );

    const headerText =
        selectedTeams.length === 0
            ? placeholder
            : selectedTeams.length === 1
                ? selectedTeams[0].name
                : `Выбрано команд: ${selectedTeams.length}`;

    return (
        <div className="custom-select" ref={ref}>
            <div
                className="custom-select-header"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span
                    className={`custom-select-header-text ${
                        selectedTeams.length === 0 ? "placeholder" : ""
                    }`}
                >
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
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default CustomSelect;