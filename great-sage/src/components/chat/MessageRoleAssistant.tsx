import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../../css/markdown.css';
import LoadingDots from '../utils/LoadingDots';
import { ChatNode } from '../utils/ChatAlgos';
import Tooltip from '../utils/Tooltip';


interface MessageRoleAssistantProps {
    message: string;
    loading?: boolean;
    chatNode: ChatNode | null;
}

const MessageRoleAssistant: React.FC<MessageRoleAssistantProps> = ({ message, chatNode, loading = false }) => {
    return (
        <>
            {
                (chatNode) &&
                <>
                    <div className='assistant-msg-stats'>
                        <div className='assistant-msg-stat'>
                            <Tooltip text='Model'><b>{chatNode.model_used}</b></Tooltip>
                        </div>
                        <div className='assistant-msg-stat'>
                            <Tooltip text='Response Time'><b>{chatNode.response_time}</b>ms</Tooltip>
                        </div>
                        {/* <div className='assistant-msg-stat'>{chatNode.creation_date.toDateString()}</div> */}
                    </div>
                </>
            }

            <div className='msg-role-assistant'>
                {loading ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <LoadingDots />
                    </div>
                    :
                    <div>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message}
                        </ReactMarkdown>
                    </div>
                }
            </div>
        </>
    );
};

export default MessageRoleAssistant;