import React from 'react';
import '../../css/chatground.css';
import type { Property } from 'csstype';

type LoadingDotsProps = {
    dotsColor?: Property.BackgroundColor;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ dotsColor }) => {
    return (
        <>
            <div className="loading-dots">
                <span className="dot" style={{ backgroundColor: dotsColor }}></span>
                <span className="dot" style={{ backgroundColor: dotsColor }}></span>
                <span className="dot" style={{ backgroundColor: dotsColor }}></span>
            </div>
        </>
    );
}

export default LoadingDots;