import React from 'react';
import addCircleIcon from '../../icons/add_circle.svg';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../App';

interface NewChatButtonProps {
    disabled: boolean;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ disabled = false }) => {
    const navigate = useNavigate();
    return (
        <div className='new-chat-btn'
            style={{
                opacity: disabled ? 0.7 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={(e) => { e.preventDefault(); navigate(AppRoutes.HOME); }}
        >
            <img src={addCircleIcon} alt="add-icon" height={24} width={24} />
            <span style={{ fontSize: '20px' }}>New Chat</span>
        </div>
    );
};

export default NewChatButton;
