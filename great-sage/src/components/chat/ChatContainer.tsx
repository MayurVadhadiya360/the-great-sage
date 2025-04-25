import React from 'react';
import MessageRoleAssistant from './MessageRoleAssistant';
import MessageRoleUser from './MessageRoleUser';
import { Chat } from '../utils/ChatAlgos';

// Define the interface for the component's props
interface ChatContainerProps {
    chat: Chat | null;
    loadingResponse?: boolean;
    loadingUserMsg?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ chat, loadingResponse = false, loadingUserMsg = '' }) => {
    if (!chat || chat.isEmpty()) {
        return <div className='chat-placeholder'>Start a new conversation.</div>;
    }
    return (
        <>
            <div className='chat-container'>
                {
                    chat.traverseActiveConversations((node) => {
                        return (
                            <>
                                <MessageRoleUser key={`${node._id}-user-msg`} message={node.user_msg} />
                                <MessageRoleAssistant key={`${node._id}-assistant-msg`} message={node.assistant_msg} chatNode={node} />
                            </>
                        );
                    })
                }
                {
                    loadingResponse &&
                    <>
                        <MessageRoleUser key={`loading-user-msg`} message={loadingUserMsg} />
                        <MessageRoleAssistant key={`loading-assistant-msg`} loading={loadingResponse} message='' chatNode={null} />
                    </>
                }
            </div>
        </>
    );
};

export default ChatContainer;
