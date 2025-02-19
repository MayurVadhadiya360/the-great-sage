import React, { useState, useRef, ReactNode, FC } from "react";

interface TooltipProps {
  text: string;
  delay?: number;
  children: ReactNode;
}

const Tooltip: FC<TooltipProps> = ({ text, delay = 500, children }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const timerRef = useRef<number | null>(null);

  // Called whenever the mouse moves over the element.
  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    // Update the tooltip position (with a small offset)
    setPosition({ x: clientX + 10, y: clientY + 10 });

    // If the tooltip is already visible and the mouse moves, hide it.
    if (visible) {
      setVisible(false);
    }

    // Clear any existing timer since the mouse is moving.
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    // Start a new timer. If the mouse remains stable for the delay, show the tooltip.
    timerRef.current = window.setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  // Clear the timer and hide the tooltip when the mouse leaves.
  const handleMouseLeave = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  };

  return (
    <span
      style={{ display: "inline-block", position: "relative" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            backgroundColor: "black",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            zIndex: 1000,
            border: '1px solid white',
          }}
        >
          {text}
        </div>
      )}
    </span>
  );
};

export default Tooltip;
