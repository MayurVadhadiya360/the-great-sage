import React from 'react';

interface MessageRoleUserProps {
    message: string;
}

const MessageRoleUser: React.FC<MessageRoleUserProps> = ({ message }) => {
    return (
        <>
            <div className='msg-role-user'>
                <pre>
                    {message}
                </pre>
            </div>
        </>
    );
};

export default MessageRoleUser;
