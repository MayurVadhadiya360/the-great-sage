import React from 'react';
import Sidebar from './sidebar/Sidebar';
import SidebarMenuIcon from './sidebar/SidebarMenuIcon';
import ChatGround from './chat/ChatGround';
import { useAppContext } from '../App';
import ChatGroundUnsigned from './chat/ChatGroundUnsigned';
import { useParams } from 'react-router-dom';
import ChatGroundNewChat from './chat/ChatGroundNewChat';

const ChatApp: React.FC = () => {
    let { chatId } = useParams();
    const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(true);
    const { userProfile } = useAppContext();
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
                    <ChatGroundUnsigned />
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