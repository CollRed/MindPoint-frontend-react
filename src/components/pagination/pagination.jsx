import React, { useEffect, useState } from "react";
import "./pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const [inputValue, setInputValue] = useState(currentPage);


    useEffect(() => {
        setInputValue(currentPage);
    }, [currentPage]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const handleInputBlur = () => {
        let page = parseInt(inputValue, 10);

        if (isNaN(page)) {
            page = currentPage;
        }

        page = Math.max(1, Math.min(totalPages, page));
        setInputValue(page);
        if (page !== currentPage) {
            onPageChange(page);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur();
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
                <span>&lt;</span>
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
                <span>&gt;</span>
            </button>
        </div>

    );
}
