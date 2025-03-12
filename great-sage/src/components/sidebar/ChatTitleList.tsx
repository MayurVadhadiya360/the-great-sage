import React, { useState } from 'react';
import ChatTitleListItem from './ChatTitleListItem';
import { APIRoutes, AppRoutes, useAppContext } from '../../App';
import { useNavigate } from 'react-router-dom';

interface ChatItem {
    chatId: string;
    chatTitle: string;
}

type ChatTitleListProps = {
    filter: string;
    activeChatId: string | null;
};

const exampleChatItems: ChatItem[] = [
    { chatId: '1', chatTitle: 'Chat 1' },
    { chatId: '2', chatTitle: 'Chat 2' },
    { chatId: '3', chatTitle: 'Chat 3' },
    { chatId: '4', chatTitle: 'Chat 4' },
    { chatId: '5', chatTitle: 'Chat 5' },
    { chatId: '6', chatTitle: 'Chat 6 long long title' },
    { chatId: '7', chatTitle: 'Chat 7' },
    { chatId: '8', chatTitle: 'Chat 8' },
    { chatId: '9', chatTitle: 'Chat 9' },
    { chatId: '10', chatTitle: 'Chat 10' },
    { chatId: '11', chatTitle: 'Chat 11' },
    { chatId: '12', chatTitle: 'Chat 12 long long title' },
    { chatId: '13', chatTitle: 'Chat 13' },
    { chatId: '14', chatTitle: 'Chat 14' },
    { chatId: '15', chatTitle: 'Chat 15' },
    { chatId: '16', chatTitle: 'Chat 16' },
    { chatId: '17', chatTitle: 'Chat 17' },
    { chatId: '18', chatTitle: 'Chat 18 long long title' },
    { chatId: '19', chatTitle: 'Chat 19' },
    { chatId: '20', chatTitle: 'Chat 20' },
];

const ChatTitleList: React.FC<ChatTitleListProps> = ({ filter, activeChatId }) => {
    const navigate = useNavigate();
    const { userProfile } = useAppContext();
    const [chatTitleList, setChatTitleList] = useState<ChatItem[]>(exampleChatItems);

    const handleChatListFetch = async () => {
        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.CHAT_LIST}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        }
        else {
            const data = await response.json();
            console.warn(data);
        }
    }

    React.useEffect(() => {
        if (userProfile) {
            handleChatListFetch();
        }
    }, [userProfile]);


    const updateChatTitle = (chatId: string, chatTitle: string) => {
        setChatTitleList(prevList =>
            prevList.map(chat =>
                chat.chatId === chatId ? { ...chat, chatTitle } : chat
            )
        );
    };

    const deleteChat = (chatId: string) => {
        setChatTitleList(prevList => prevList.filter(chat => chat.chatId !== chatId));
    };

    return (
        <div className="chat-title-list">
            {chatTitleList.filter((chat) => chat.chatTitle.toLowerCase().includes(filter.toLowerCase())).map((chat, index) => (
                <ChatTitleListItem
                    key={`${chat.chatId}${index}`}
                    chatId={chat.chatId}
                    chatTitle={chat.chatTitle}
                    active={chat.chatId === activeChatId}
                    updateChatTitle={updateChatTitle}
                    deleteChat={deleteChat}
                    onClick={() => { navigate(`${AppRoutes.CHAT}/${chat.chatId}`) }}
                />
            ))}
        </div>
    );
};

export default ChatTitleList;
