import React, { useState, useRef, useEffect } from 'react';
import threeDotsIcon from '../../icons/3-dots-icon.svg';
import { ChatListItemActions } from './ChatListItemActions';


const ChatTitleListItem = ({ chatId = "", chatTitle = "", active = false, onClick = () => { }, updateChatTitle = (cid, ctitle) => { }, deleteChat = (cid) => { }, }) => {
    const [showChatActions, setShowChatActions] = useState(false);
    const [positionXY, setPositionXY] = useState({ x: 0, y: 0 });
    const [chatTitleEditing, setChatTitleEditing] = useState(false);
    const [tempChatTitle, setTempChatTitle] = useState(chatTitle);
    const menuRef = useRef(null);

    const onEditChatTitle = () => {
        setChatTitleEditing(true);
        setShowChatActions(false);
    };

    const handleEditChatTitle = (newTitle) => {
        setTempChatTitle(newTitle);
        updateChatTitle(chatId, newTitle);
        setChatTitleEditing(false);
    };

    const onDelete = () => {
        deleteChat(chatId);
        setShowChatActions(false);
    };

    // Function to handle clicks outside the menu
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowChatActions(false);
            setChatTitleEditing(false);
        }
    };

    useEffect(() => {
        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Cleanup event listener on unmount
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div ref={menuRef} className={`chat-title-list-item ${active ? 'active' : ''}`}>
                {
                    chatTitleEditing
                        ?
                        <input type="text" name={`chat-${chatId}-title`} id={`chat-${chatId}-title`}
                            style={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                fontSize: '20px',
                                width: '80%',
                                border: 'none',
                            }}
                            defaultValue={tempChatTitle}
                            onKeyDown={(e) => {
                                console.log("key down")
                                console.log(e.key);
                                if (e.key === 'Enter') {
                                    handleEditChatTitle(e.currentTarget.value);
                                }
                            }}
                        />
                        :
                        <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {tempChatTitle}
                        </span>
                }

                <img src={threeDotsIcon} alt="options"
                    style={{
                        cursor: 'pointer',
                    }}

                    onClick={(e) => {
                        if (!showChatActions) {
                            setPositionXY({ x: e.clientX, y: e.clientY });
                        }
                        setShowChatActions(prev => !prev);
                    }}
                />
                {
                    showChatActions &&
                    <ChatListItemActions
                        chatId={chatId}
                        positionXY={positionXY}
                        onEdit={onEditChatTitle}
                        onDelete={onDelete}
                    />}
            </div>

        </>
    );
};

export { ChatTitleListItem };