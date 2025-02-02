import React from 'react';
import '../css/sidebar.css';

import loginIcon from '../icons/login.svg';
import chevronRightIcon from '../icons/chevron_right.svg';
import loginIcon19FCF1 from '../icons/login_19FCF1.svg';
import chevronRightIcon19FCF1 from '../icons/chevron_right_19FCF1.svg';
import logoutIcon from '../icons/logout.svg';
import accountIcon from '../icons/account_circle.svg';

import { SidebarMenuIcon } from './sidebar_comps/SidebarMenuIcon';
import { NewChatButton } from './sidebar_comps/NewChatButton';
import { ChatSearchbar } from './sidebar_comps/ChatSearchbar';
import { ChatTitleList } from './sidebar_comps/ChatTitleList';
import { SidebarMenuButton } from './sidebar_comps/SidebarMenuButton';

interface SidebarProps {
    sidebarVisible: boolean;
    setSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarVisible = true, setSidebarVisible = () => { } }) => {
    return (
        <>
            <div className="sidebar">
                <div className='sidebar-top'>
                    <SidebarMenuIcon sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} />
                    <NewChatButton disabled />
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <ChatSearchbar />
                </div>

                <div className='chat-title-list-scroll'>
                    <ChatTitleList />
                </div>

                <div className='sidebar-bottom'>
                    <SidebarMenuButton
                        text={'Login'}
                        prefixIcon={loginIcon}
                        suffixIcon={chevronRightIcon}
                        onClick={() => console.log('Navigate to Login')}
                    />

                    <SidebarMenuButton
                        text={'Register'}
                        textColor='#19FCF1'
                        prefixIcon={loginIcon19FCF1}
                        suffixIcon={chevronRightIcon19FCF1}
                        onClick={() => console.log('Navigate to Register')}
                    />

                    {/* <SidebarMenuButton
                        text={'Account'}
                        prefixIcon={accountIcon}
                        suffixIcon={chevronRightIcon}
                        onClick={() => console.log('Navigate to Account')}
                    />

                    <SidebarMenuButton
                        text={'Logout'}
                        textColor='red'
                        prefixIcon={logoutIcon}
                        onClick={() => console.log('Logout')}
                    /> */}
                </div>
            </div>
        </>
    );

};

export default Sidebar;
