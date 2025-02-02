import React from 'react';
import addCircleIcon from '../../icons/add_circle.svg';

interface NewChatButtonProps {
    disabled: boolean;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ disabled = false }) => {
    return (
        <div
            style={{
                backgroundColor: '#3F3F3F',
                display: 'flex',
                flexDirection: 'row',
                gap: '.2rem',
                alignItems: 'center',
                justifyContent: 'center',
                height: '35px',
                borderRadius: '17px',
                padding: '0 0.5rem',
                opacity: disabled ? 0.7 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
        >
            <img src={addCircleIcon} alt="add-icon" height={24} width={24} />
            <span style={{ fontSize: '20px' }}>New Chat</span>
        </div>
    );
};

export { NewChatButton };
