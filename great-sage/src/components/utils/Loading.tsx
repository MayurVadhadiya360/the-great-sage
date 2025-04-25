import React from 'react'
import LoadingDots from './LoadingDots';

const Loading: React.FC = () => {
    return (
        <>
            <div className="loading-container">
                <LoadingDots dotsColor={'white'}/>
            </div>
        </>
    );
};

export default Loading;