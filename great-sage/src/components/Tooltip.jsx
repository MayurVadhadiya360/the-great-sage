import React, { useState } from "react";

const Tooltip = ({ children, text, delay = 500 }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    let timeoutId = null;

    const handleMouseEnter = (event) => {
        const { clientX, clientY } = event;

        // Set tooltip position near cursor
        setPosition({ x: clientX + 10, y: clientY + 10 });

        // Delay before showing tooltip
        timeoutId = setTimeout(() => {
            setVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeoutId);
        setVisible(false);
    };

    return (
        <span
            style={{ display: "inline-block" }}
            
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {visible && (
                <div
                    style={{
                        position: "fixed",
                        left: position.x,
                        top: position.y,
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        zIndex: 1000,
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                    }}
                >
                    {text}
                </div>
            )}
        </span>
    );
};

export { Tooltip };
