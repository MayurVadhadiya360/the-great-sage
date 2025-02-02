import React, { useState } from 'react';
import { ChatTitleListItem } from './ChatTitleListItem';

interface ChatItem {
    chatId: number;
    chatTitle: string;
}

const ChatTitleList: React.FC = () => {
    const [chatTitleList, setChatTitleList] = useState<ChatItem[]>([
        { chatId: 1, chatTitle: 'Chat 1' },
        { chatId: 2, chatTitle: 'Chat 2' },
        { chatId: 3, chatTitle: 'Chat 3' },
        { chatId: 4, chatTitle: 'Chat 4' },
        { chatId: 5, chatTitle: 'Chat 5' },
        { chatId: 6, chatTitle: 'Chat 6' },
        { chatId: 7, chatTitle: 'Chat 7' },
        { chatId: 8, chatTitle: 'Chat 8' },
        { chatId: 9, chatTitle: 'Chat 9' },
        { chatId: 10, chatTitle: 'Chat 10' },
        { chatId: 11, chatTitle: 'Chat 11' },
        { chatId: 12, chatTitle: 'Chat 12' },
        { chatId: 13, chatTitle: 'Chat 13' },
        { chatId: 14, chatTitle: 'Chat 14' },
        { chatId: 15, chatTitle: 'Chat 15' },
        { chatId: 16, chatTitle: 'Chat 16' },
        { chatId: 17, chatTitle: 'Chat 17' },
        { chatId: 18, chatTitle: 'Chat 18' },
        { chatId: 19, chatTitle: 'Chat 19' },
        { chatId: 20, chatTitle: 'Chat 20' },
    ]);
    const [currentChatId, setCurrentChatId] = useState<number>(1);

    const updateChatTitle = (chatId: number, chatTitle: string) => {
        setChatTitleList(prevList =>
            prevList.map(chat =>
                chat.chatId === chatId ? { ...chat, chatTitle } : chat
            )
        );
    };

    const deleteChat = (chatId: number) => {
        setChatTitleList(prevList => prevList.filter(chat => chat.chatId !== chatId));
    };

    return (
        <div className="chat-title-list">
            {chatTitleList.map((chat, index) => (
                <ChatTitleListItem
                    key={`${chat.chatId}${index}`}
                    chatId={chat.chatId}
                    chatTitle={chat.chatTitle}
                    active={chat.chatId === currentChatId}
                    updateChatTitle={updateChatTitle}
                    deleteChat={deleteChat}
                />
            ))}
        </div>
    );
};

export { ChatTitleList };
