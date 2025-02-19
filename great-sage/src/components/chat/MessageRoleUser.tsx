import React from 'react';

interface MessageRoleUserProps {
    message: string;
}

const MessageRoleUser: React.FC<MessageRoleUserProps> = ({ message }) => {
    return (
        <>
            <div className='msg-role-user'>
                <p>
                    {message}
                </p>
            </div>
        </>
    );
};

export default MessageRoleUser;
