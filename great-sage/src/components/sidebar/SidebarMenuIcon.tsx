import React from 'react';
import menuIcon from '../../icons/menu.svg';
import xIcon from '../../icons/X.svg';

interface SidebarMenuIconProps {
    sidebarVisible: boolean;
    setSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarMenuIcon: React.FC<SidebarMenuIconProps> = ({ sidebarVisible = true, setSidebarVisible }) => {
    return (
        <div className='sidebar-menu-icon' onClick={() => { setSidebarVisible(prev => !prev); }}>
            <img src={sidebarVisible ? xIcon : menuIcon} alt="menu-icon" height={'24px'} width={'24px'} />
        </div>
    );
};

export default SidebarMenuIcon;
