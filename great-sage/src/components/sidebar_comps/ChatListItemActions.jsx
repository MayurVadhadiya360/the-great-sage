import React from 'react';
import editIcon from '../../icons/edit-pen.svg';
import deleteIcon from '../../icons/delete-bin.svg';

const ChatListItemActions = ({ chatId, positionXY = { x: 0, y: 0 }, onEdit = () => { }, onDelete = () => { } }) => {
    return (
        <>
            <div
                className='chat-action-list'
                style={{
                    position: 'fixed',
                    left: positionXY.x,
                    top: positionXY.y,
                    zIndex: 10,
                }}
            >

                <button
                    className="chat-action-item"
                    onClick={(e) => { onEdit(); console.log('edit'); }}
                >
                    <img src={editIcon} alt="edit-chat-name" height='24px' width='24px' />
                    <span style={{ color: 'white' }}>Rename</span>
                </button>

                <button
                    className="chat-action-item"
                    onClick={(e) => { onDelete(); console.log('delete'); }}
                >
                    <img src={deleteIcon} alt="edit-chat-name" height='24px' width='24px' />
                    <span style={{ color: 'red' }}>Delete</span>
                </button>

            </div>
        </>
    );
};

export { ChatListItemActions };