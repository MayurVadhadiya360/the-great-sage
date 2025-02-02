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
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                height: '45px',
                backgroundColor: '#3F3F3F',
                borderRadius: '10px',
                padding: '0 .4rem',
                gap: '.5rem',
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            {prefixIcon && <img src={prefixIcon} alt="prefix-icon" />}
            <span style={{ flex: 1, fontSize: '24px', color: textColor }}>
                {text}
            </span>
            {suffixIcon && <img src={suffixIcon} alt="suffix-icon" />}
        </div>
    );
};

export { SidebarMenuButton };
