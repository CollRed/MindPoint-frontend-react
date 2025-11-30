import React, { useEffect, useState } from "react";
import "./pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const [inputValue, setInputValue] = useState(currentPage);

    // Следим за внешним изменением currentPage
    useEffect(() => {
        setInputValue(currentPage);
    }, [currentPage]);

    // Обработка ввода пользователем
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
    };

    // При потере фокуса или на Enter
    const handleInputBlur = () => {
        let page = parseInt(inputValue, 10);

        if (isNaN(page)) {
            page = currentPage; // вернуть старое значение, если не число
        }

        page = Math.max(1, Math.min(totalPages, page));
        setInputValue(page); // обновим input на случай, если обрезали
        if (page !== currentPage) {
            onPageChange(page);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur(); // Триггерим blur для применения
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                className="page-btn arrow"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            <div className="page-display">
                <input
                    type="number"
                    className="page-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    min={1}
                    max={totalPages}
                />
                <span className="divider">/</span>
                <span className="total">{totalPages}</span>
            </div>

            <button
                className="page-btn arrow"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>

    );
}
