import React from 'react';
import Sidebar from './sidebar/Sidebar';
import SidebarMenuIcon from './sidebar/SidebarMenuIcon';
import ChatGround from './chat/ChatGround';

interface ChatAppProps {
    chatId?: string | null;
}

const ChatApp: React.FC<ChatAppProps> = ({ chatId = null }) => {
    const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(true);
    return (
        <>
            <div className='chat-app'>
                {sidebarVisible ?
                    <Sidebar
                        sidebarVisible={sidebarVisible}
                        setSidebarVisible={setSidebarVisible}
                    />
                    :
                    <div className='show-sidebar-icon'>
                        <SidebarMenuIcon
                            sidebarVisible={sidebarVisible}
                            setSidebarVisible={setSidebarVisible}
                        />
                    </div>
                }
                <ChatGround chatId={chatId} />
            </div></>
    );
}

export default ChatApp;