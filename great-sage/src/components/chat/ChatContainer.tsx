import React from 'react';
import MessageRoleAssistant from './MessageRoleAssistant';
import MessageRoleUser from './MessageRoleUser';
import { Chat } from '../utils/ChatAlgos';

// Define the interface for the component's props
interface ChatContainerProps {
    chat: Chat | null;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ chat }) => {
    if (!chat || chat.isEmpty()) {
        return <div >No chat available. Start a new conversation.</div>;
    }
    return (
        <>
            <div className='chat-container'>
                {
                    chat.traverseActiveConversations((node) => {
                        return (
                            <>
                                <MessageRoleUser key={`${node._id}-user-msg`} message={node.user_msg} />
                                <MessageRoleAssistant key={`${node._id}-assistant-msg`} message={node.assistant_msg} />
                            </>
                        );
                    })
                }
            </div>
        </>
    );
};

export default ChatContainer;
