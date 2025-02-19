import React from 'react';

interface MessageRoleAssistantProps {
    message: string;
}

const MessageRoleAssistant: React.FC<MessageRoleAssistantProps> = ({ message }) => {
    return (
        <>
            <div className='msg-role-assistant'>
                <p>
                    {message}
                </p>
            </div>
        </>
    );
};

export default MessageRoleAssistant;