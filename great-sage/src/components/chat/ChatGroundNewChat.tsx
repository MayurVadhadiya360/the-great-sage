import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/chatground.css';
import upArrowIcon from '../../icons/up-arrow.svg';
import editIcon from '../../icons/edit-pen.svg';
import checkIcon from '../../icons/check.svg';
import UserMsgField from './UserMsgField';
import ChatContainer from './ChatContainer';
import { APIRoutes, AppRoutes, useAppContext } from '../../App';
import { ChatList } from '../utils/ChatAlgos';
import Loading from '../utils/Loading';


const ChatGroundNewChat: React.FC = () => {
    const navigate = useNavigate();
    const { setChatlist } = useAppContext();
    const [userMessage, setUserMessage] = React.useState<string>("");
    const [currentModel, setCurrentModel] = React.useState<string>("deepseek-r1-distill-llama-70b");
    const [systemMsg, setSystemMsg] = React.useState<string>("");
    const [systemMsgEditing, setSystemMsgEditing] = React.useState<boolean>(false);
    const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);
    const [isResponseLoading, setIsResponseLoading] = React.useState<boolean>(false);

    const updateResponseLoadingStatus = (isLoading: boolean) => {
        setIsResponseLoading(isLoading);
    };

    const handleSubmit = async () => {
        updateResponseLoadingStatus(true);

        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.NEW_CHAT}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: currentModel,
                system_msg: systemMsg.trim(),
                message: userMessage.trim(),
            })
        });

        const data = await response.json();
        updateResponseLoadingStatus(false);
        if (response.ok && data.status === 'success') {
            const chat_id = data.data.chat_id;
            const chat_title = data.data.chat_title;
            const creation_date = data.data.creation_date;
            const last_update = data.data.last_update;
            setChatlist(prevChatList => {
                prevChatList.addChatData(chat_id, chat_title, new Date(creation_date), new Date(last_update));
                const newChatList = new ChatList(prevChatList);
                return newChatList;
            });
            navigate(`${AppRoutes.CHAT}/${chat_id}`);
        }
        else {
            console.error(APIRoutes.NEW_CHAT, data);
        }

        scrollToBottonChatList();
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
        const scrollBtnOffset = 200;

        const handleScroll = () => {
            if (!chatList) return;

            // Check if scrolled to bottom
            const isAtBottom = chatList.scrollHeight - chatList.scrollTop - scrollBtnOffset <= chatList.clientHeight + 1;
            setShowScrollButton(!isAtBottom);
        };

        chatList?.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => chatList?.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {isResponseLoading && <Loading />}

            <div className="chat-ground-container">
                <div className="system-msg-container">
                    <div className="system-msg">
                        <div
                            className="system-msg-edit-btn"
                            onClick={(e) => handleSystemMsgChange()}
                        >
                            <img src={systemMsgEditing ? checkIcon : editIcon} alt='check-edit' height='20px' width='20px' />
                        </div>

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
                </div>

                <div className="chat-ground" id="chat-list">
                    <div className="chat-list" >
                        <ChatContainer chat={null} />
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
                            setUserMessage("");
                            handleSubmit();
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default ChatGroundNewChat;
