import React from 'react';

interface MessageRoleUserProps {
    message: string;
}

const MessageRoleUser: React.FC<MessageRoleUserProps> = ({ message }) => {
    return (
        <>
            <div style={{
                backgroundColor: '#3F3F3F',
                borderRadius: '10px',
                minHeight: '40px',
                maxWidth: '80%',
                alignSelf: 'flex-end',
                display: 'flex',
                alignItems: 'center',
                margin: '.5rem',
                padding: '0 .5rem',
            }}>
                {message}
            </div>

        </>
    );
};

export default MessageRoleUser;
