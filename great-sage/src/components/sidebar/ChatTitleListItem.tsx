import React, { useState, useRef, useEffect } from 'react';
import threeDotsIcon from '../../icons/3-dots-icon.svg';
import ChatListItemActions from './ChatListItemActions';
import Tooltip from '../utils/Tooltip';

interface ChatTitleListItemProps {
    chatId: number;
    chatTitle: string;
    active?: boolean;
    onClick?: () => void;
    updateChatTitle: (chatId: number, chatTitle: string) => void;
    deleteChat: (chatId: number) => void;
}

const ChatTitleListItem: React.FC<ChatTitleListItemProps> = ({
    chatId,
    chatTitle,
    active = false,
    onClick = () => { },
    updateChatTitle,
    deleteChat,
}) => {
    const [showChatActions, setShowChatActions] = useState<boolean>(false);
    const [positionXY, setPositionXY] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [chatTitleEditing, setChatTitleEditing] = useState<boolean>(false);
    const [tempChatTitle, setTempChatTitle] = useState<string>(chatTitle);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const onEditChatTitle = () => {
        setChatTitleEditing(true);
        setShowChatActions(false);
    };

    const handleEditChatTitle = (newTitle: string) => {
        setTempChatTitle(newTitle);
        updateChatTitle(chatId, newTitle);
        setChatTitleEditing(false);
    };

    const onDelete = () => {
        deleteChat(chatId);
        setShowChatActions(false);
    };

    // Function to handle clicks outside the menu
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowChatActions(false);
            setChatTitleEditing(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={menuRef} className={`chat-title-list-item ${active ? 'active' : ''}`} onClick={(e) => onClick()}>
            {chatTitleEditing ? (
                <input
                    type="text"
                    name={`chat-${chatId}-title`}
                    id={`chat-${chatId}-title`}
                    className='chat-title-list-item-edit'
                    defaultValue={tempChatTitle}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleEditChatTitle(e.currentTarget.value);
                        }
                    }}
                />
            ) : (
                <Tooltip text={tempChatTitle}>
                    <span>
                        {tempChatTitle}
                    </span>
                </Tooltip>
            )}

            <img
                src={threeDotsIcon}
                alt="options"
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                    if (!showChatActions) {
                        setPositionXY({ x: e.clientX + 10, y: e.clientY + 10 });
                    }
                    setShowChatActions((prev) => !prev);
                }}
            />

            {showChatActions && (
                <ChatListItemActions
                    chatId={`${chatId}`}
                    positionXY={positionXY}
                    onEdit={onEditChatTitle}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
};

export default ChatTitleListItem;
