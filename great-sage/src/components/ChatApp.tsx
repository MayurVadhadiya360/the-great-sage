import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../App';
import Sidebar from './sidebar/Sidebar';
import SidebarMenuIcon from './sidebar/SidebarMenuIcon';
import ChatGround from './chat/ChatGround';
import ChatGroundAnonymous from './chat/ChatGroundAnonymous';
import ChatGroundNewChat from './chat/ChatGroundNewChat';

const ChatApp: React.FC = () => {
    let { chatId } = useParams();
    const { userProfile } = useAppContext();
    const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(true);

    return (
        <>
            <div className='chat-app'>
                {sidebarVisible ?
                    <Sidebar
                        sidebarVisible={sidebarVisible}
                        setSidebarVisible={setSidebarVisible}
                        activeChatId={chatId ?? null}
                    />
                    :
                    <div className='show-sidebar-icon'>
                        <SidebarMenuIcon
                            sidebarVisible={sidebarVisible}
                            setSidebarVisible={setSidebarVisible}
                        />
                    </div>
                }
                {(userProfile === null) ?
                    <ChatGroundAnonymous />
                    :
                    (chatId) ?
                        <ChatGround chatId={chatId} />
                        :
                        <ChatGroundNewChat />
                }
            </div></>
    );
}

export default ChatApp;