import React from 'react';
import menuIcon from '../../icons/menu.svg';
import xIcon from '../../icons/X.svg';

const SidebarMenuIcon = ({ sidebarVisible=true, setSidebarVisible = (bool) => { } }) => {
    return (
        <>
            <div
                style={{
                    backgroundColor: '#3F3F3F',
                    borderRadius: '100%',
                    width: '35px',
                    height: '35px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={(e) => { setSidebarVisible(prev => !prev) }}
            >
                <img src={sidebarVisible ? xIcon : menuIcon} alt="menu-icon" height={'24px'} width={'24px'} />
            </div>
        </>
    );
}

export { SidebarMenuIcon };