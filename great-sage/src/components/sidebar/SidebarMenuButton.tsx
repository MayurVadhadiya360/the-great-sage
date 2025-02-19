import React from 'react';

interface SidebarMenuButtonProps {
    text: string;
    textColor?: string;
    prefixIcon?: string | null;
    suffixIcon?: string | null;
    onClick?: () => void;
}

const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({
    text,
    textColor = 'white',
    prefixIcon = null,
    suffixIcon = null,
    onClick = () => { },
}) => {
    return (
        <div className='sidebar-menu-button' onClick={onClick}>
            {prefixIcon && <img src={prefixIcon} alt="prefix-icon" height='40px' width='40px' />}
            <span style={{ flex: 1, fontSize: '24px', color: textColor }}>
                {text}
            </span>
            {suffixIcon && <img src={suffixIcon} alt="suffix-icon" />}
        </div>
    );
};

export default SidebarMenuButton;
