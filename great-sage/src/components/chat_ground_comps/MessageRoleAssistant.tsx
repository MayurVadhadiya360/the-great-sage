import React from 'react';

interface MessageRoleAssistantProps {
    message: string;
}

const MessageRoleAssistant: React.FC<MessageRoleAssistantProps> = ({ message }) => {
    return (
        <>
            <div style={{
                backgroundColor: 'red',
                borderRadius: '10px',
                minHeight: '40px',
                width: '100%',
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                overflow: 'clip'
            }}>
                {message}
            </div></>
    );
};

export default MessageRoleAssistant;