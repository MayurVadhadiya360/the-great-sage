import React from 'react';
import '../../css/chatground.css';
import upArrowIcon from '../../icons/up-arrow.svg';
import editIcon from '../../icons/edit-pen.svg';
import checkIcon from '../../icons/check.svg';
import UserMsgField from './UserMsgField';
import ChatContainer from './ChatContainer';
import { Chat } from '../utils/ChatAlgos';
import { APIRoutes } from '../../App';


const ChatGroundUnsigned: React.FC = () => {
    const createFreeChatInstance: () => Chat = () => {
        const tempChat = new Chat("chat_id", "unsinged_user", "free_chat", null, new Date(), new Date());
        return tempChat;
    };

    const [userMessage, setUserMessage] = React.useState<string>("");
    const [currentModel, setCurrentModel] = React.useState<string>("deepseek-r1-distill-llama-70b");
    const [systemMsg, setSystemMsg] = React.useState<string>("");
    const [systemMsgEditing, setSystemMsgEditing] = React.useState<boolean>(false);
    const [chat, setChat] = React.useState<Chat>(() => createFreeChatInstance());

    const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);

    const handleSubmit = async () => {
        if (chat.isEmpty()) {
            chat.updateSystemMsg(systemMsg);
        }

        let chatContext: { role: string, content: string }[] = chat.getChatContext();

        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.UNSIGNED_CHAT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: currentModel,
                message: userMessage.trim(),
                context: chatContext,
            })
        });

        const data = await response.json();
        if (response.ok) {
            const _id = data.data._id;
            const resMsg = data.data.response;
            const resTime = data.data.response_time;

            setChat(prevChat => {
                if (!prevChat) return prevChat; // If null, do nothing
                prevChat.addConversationV2(_id, userMessage.trim(), resMsg, currentModel, resTime);
                // Manually create a new Chat instance to trigger re-render
                const newChat = new Chat(prevChat);
                return newChat; // React will now detect state change
            });
        }
        else {
            console.error(APIRoutes.UNSIGNED_CHAT, data);
        }

        scrollToBottonChatList()
    };

    const handleSystemMsgChange = () => {
        if (systemMsgEditing) {
            const inputElement = document.getElementById("system-msg") as HTMLInputElement | null;
            if (inputElement) {
                setSystemMsg(inputElement.value.trim());
            }
        }
        setSystemMsgEditing(prev => !prev);
    };

    const scrollToBottonChatList = () => {
        setShowScrollButton(false);
        const chatList = document.getElementById("chat-list") as HTMLDivElement | null;
        chatList?.scrollTo({ top: chatList.scrollHeight, behavior: 'smooth' });
    };

    React.useEffect(() => {
        const chatList = document.getElementById("chat-list");

        const handleScroll = () => {
            if (!chatList) return;

            // Check if scrolled to bottom
            const isAtBottom = chatList.scrollHeight - chatList.scrollTop <= chatList.clientHeight + 1;
            setShowScrollButton(!isAtBottom);
        };

        chatList?.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => chatList?.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="chat-ground-container">
            <div className="system-msg-container">
                {((chat.isEmpty()) || (systemMsg !== "")) &&
                    <div className="system-msg">
                        {(chat.isEmpty()) && (
                            <div
                                className="system-msg-edit-btn"
                                onClick={(e) => handleSystemMsgChange()}
                            >
                                <img src={systemMsgEditing ? checkIcon : editIcon} alt='edit-check' height='20px' width='20px' />
                            </div>
                        )
                        }
                        <b>System Message: </b>
                        {systemMsgEditing ?
                            <input
                                type="text"
                                name="system-msg"
                                id="system-msg"
                                className="system-msg-edit"
                                defaultValue={systemMsg}
                                placeholder="Enter System Message"
                            />
                            :
                            <span>
                                {systemMsg === "" ?
                                    "Enter System Message (optional)" :
                                    systemMsg
                                }
                            </span>
                        }
                    </div>
                }
            </div>

            <div className="chat-ground" id="chat-list">
                <div className="chat-list" >
                    <ChatContainer chat={chat} />
                </div>
                {showScrollButton &&
                    <div className='scroll-to-bottom-chat-list'>
                        <div className='scroll-to-bottom-icon' onClick={() => scrollToBottonChatList()}>
                            <img src={upArrowIcon} alt='submit' height='40px' width='40px' />
                        </div>
                    </div>
                }
            </div>
            <div style={{ width: '100%', maxWidth: '50rem', margin: '1rem 0 2rem 0' }}>
                <UserMsgField
                    userMessage={userMessage}
                    setUserMessage={setUserMessage}
                    currentModel={currentModel}
                    setCurrentModel={setCurrentModel}
                    onSubmit={() => {
                        console.log("submit", userMessage);
                        setUserMessage("");
                        handleSubmit();
                    }}
                />
            </div>
        </div>
    );
};

export default ChatGroundUnsigned;
