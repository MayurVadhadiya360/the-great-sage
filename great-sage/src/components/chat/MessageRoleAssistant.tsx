import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../../css/markdown.css';

interface MessageRoleAssistantProps {
    message: string;
}

const MessageRoleAssistant: React.FC<MessageRoleAssistantProps> = ({ message }) => {
    return (
        <>
            <div className='msg-role-assistant'>
                <div>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message}
                    </ReactMarkdown>
                </div>
            </div>
        </>
    );
};

export default MessageRoleAssistant;