import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/sidebar.css';

import loginIcon from '../../icons/login.svg';
import chevronRightIcon from '../../icons/chevron_right.svg';
import loginIcon19FCF1 from '../../icons/login_19FCF1.svg';
import chevronRightIcon19FCF1 from '../../icons/chevron_right_19FCF1.svg';
import logoutIcon from '../../icons/logout.svg';
import accountIcon from '../../icons/account_circle.svg';

import SidebarMenuIcon from './SidebarMenuIcon';
import NewChatButton from './NewChatButton';
import ChatSearchbar from './ChatSearchbar';
import ChatTitleList from './ChatTitleList';
import SidebarMenuButton from './SidebarMenuButton';
import { AppRoutes, useAppContext } from '../../App';

interface SidebarProps {
    sidebarVisible: boolean;
    setSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarVisible, setSidebarVisible }) => {
    const navigate = useNavigate();

    const { logOut, userProfile } = useAppContext();
    const [searchQury, setSearchQury] = React.useState<string>('');

    const isUserLoggedIn: boolean = userProfile !== null;
    return (
        <>
            <div className="sidebar">
                <div className='sidebar-top'>
                    <SidebarMenuIcon
                        sidebarVisible={sidebarVisible}
                        setSidebarVisible={setSidebarVisible}
                    />
                    <NewChatButton disabled={!isUserLoggedIn} />
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <ChatSearchbar
                        searchQuery={searchQury}
                        setSearchQuery={setSearchQury}
                    />
                </div>

                <div className='chat-title-list-scroll'>
                    <ChatTitleList />
                </div>

                <div className='sidebar-bottom'>
                    {
                        isUserLoggedIn ?
                            <>
                                <SidebarMenuButton
                                    text={'Account'}
                                    prefixIcon={accountIcon}
                                    suffixIcon={chevronRightIcon}
                                    onClick={() => navigate(AppRoutes.ACCOUNT)}
                                />

                                <SidebarMenuButton
                                    text={'Logout'}
                                    textColor='red'
                                    prefixIcon={logoutIcon}
                                    onClick={() => logOut()}
                                />
                            </>
                            :
                            <>
                                <SidebarMenuButton
                                    text={'Login'}
                                    prefixIcon={loginIcon}
                                    suffixIcon={chevronRightIcon}
                                    onClick={() => navigate(AppRoutes.LOGIN)}
                                />

                                <SidebarMenuButton
                                    text={'Sign Up'}
                                    textColor='#19FCF1'
                                    prefixIcon={loginIcon19FCF1}
                                    suffixIcon={chevronRightIcon19FCF1}
                                    onClick={() => navigate(AppRoutes.SIGNUP)}
                                />
                            </>
                    }

                </div>
            </div>
        </>
    );

};

export default Sidebar;
