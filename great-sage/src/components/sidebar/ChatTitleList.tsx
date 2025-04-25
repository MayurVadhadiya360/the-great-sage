import React from 'react';
import ChatTitleListItem from './ChatTitleListItem';
import { APIRoutes, AppRoutes, useAppContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { ChatList } from '../utils/ChatAlgos';

type ChatTitleListProps = {
    searchQuery: string;
    activeChatId: string | null;
};


const ChatTitleList: React.FC<ChatTitleListProps> = ({ searchQuery, activeChatId }) => {
    const navigate = useNavigate();
    const { chatList, setChatlist } = useAppContext();

    const updateChatTitle = async (chatId: string, chatTitle: string) => {
        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.UPDATE_CHAT_TITLE}`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                chat_title: chatTitle,
            })
        });
        const data = await response.json();
        if (response.ok && data.status === 'success') {
            setChatlist(prevChatList => {
                prevChatList.updateChatTitle(chatId, chatTitle);
                const newChatList = new ChatList(prevChatList);
                return newChatList;
            });
        }
        else {
            console.error(APIRoutes.UPDATE_CHAT_TITLE, data);
        }
    };

    const deleteChat = async (chatId: string) => {
        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.DELETE_CHAT}`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chat_id: chatId })
        });
        const data = await response.json();
        if (response.ok && data.status === 'success') {
            setChatlist(prevChatList => {
                prevChatList.deleteChatData(chatId);
                const newChatList = new ChatList(prevChatList);
                return newChatList;
            });
            if (activeChatId === chatId) {
                navigate(`${AppRoutes.HOME}`);
            }
        }
        else {
            console.error(APIRoutes.DELETE_CHAT, data);
        }
    };

    return (
        <div className="chat-title-list">
            {chatList.getChatList(searchQuery).map((chat, index) => (
                <ChatTitleListItem
                    key={`${chat.chat_id}${index}`}
                    chatId={chat.chat_id}
                    chatTitle={chat.chat_title}
                    active={chat.chat_id === activeChatId}
                    updateChatTitle={updateChatTitle}
                    deleteChat={deleteChat}
                    onClick={() => { navigate(`${AppRoutes.CHAT}/${chat.chat_id}`) }}
                />
            ))}
        </div>
    );
};

export default ChatTitleList;
