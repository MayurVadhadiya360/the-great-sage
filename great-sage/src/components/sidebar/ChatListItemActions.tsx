import React from 'react';
import editIcon from '../../icons/edit-pen.svg';
import deleteIcon from '../../icons/delete-bin.svg';

interface ChatListItemActionsProps {
    chatId: string;
    positionXY?: { x: number; y: number };
    onEdit?: () => void;
    onDelete?: () => void;
}

const ChatListItemActions: React.FC<ChatListItemActionsProps> = ({
    chatId,
    positionXY = { x: 0, y: 0 },
    onEdit = () => { },
    onDelete = () => { },
}) => {
    return (
        <div
            className='chat-action-list'
            style={{
                position: 'fixed',
                left: positionXY.x,
                top: positionXY.y,
                zIndex: 15,
            }}
        >
            <button
                className='chat-action-item'
                onClick={() => {
                    onEdit();
                    console.log('edit');
                }}
            >
                <img src={editIcon} alt='edit-chat-name' height='24px' width='24px' />
                <span style={{ color: 'white' }}>Rename</span>
            </button>

            <button
                className='chat-action-item'
                onClick={() => {
                    onDelete();
                    console.log('delete');
                }}
            >
                <img src={deleteIcon} alt='delete-chat' height='24px' width='24px' />
                <span style={{ color: 'red' }}>Delete</span>
            </button>
        </div>
    );
};

export default ChatListItemActions ;
