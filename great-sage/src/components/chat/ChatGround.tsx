import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/chatground.css';
import upArrowIcon from '../../icons/up-arrow.svg';
import UserMsgField from './UserMsgField';
import ChatContainer from './ChatContainer';
import { Chat } from '../utils/ChatAlgos';
import { APIRoutes, AppRoutes } from '../../App';
import Loading from '../utils/Loading';

type ChatGroundProps = {
    chatId: string;
};

const ChatGround: React.FC<ChatGroundProps> = ({ chatId }) => {
    const createFreeChatInstance: () => Chat = () => {
        const tempChat = new Chat("chat_id", "unsinged_user", "free_chat", null, new Date(), new Date());
        return tempChat;
    };

    const navigate = useNavigate();
    const [userMessage, setUserMessage] = React.useState<string>("");
    const [currentModel, setCurrentModel] = React.useState<string>("deepseek-r1-distill-llama-70b");
    const [chat, setChat] = React.useState<Chat>(() => createFreeChatInstance());
    const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);
    const [loadingChatData, setLoadingChatData] = React.useState<boolean>(false);
    const [isResponseLoading, setIsResponseLoading] = React.useState<boolean>(false);
    const [responseLoadingUserMsg, setResponseLoadingUserMsg] = React.useState<string>("");

    const updateLoadingDataStatus = (isLoading: boolean) => {
        setLoadingChatData(isLoading);
    };

    const updateResponseLoadingStatus = (isLoading: boolean, loadingUserMsg: string) => {
        setIsResponseLoading(isLoading);
        setResponseLoadingUserMsg(loadingUserMsg);
    };

    const getChatData = async () => {
        updateLoadingDataStatus(true);

        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.GET_CHAT}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ chat_id: chatId })
        });

        const data = await response.json();
        updateLoadingDataStatus(false);
        if (response.ok && data.status === 'success') {
            const chatData = data.data;
            setChat(prevChat => {
                const newChat = new Chat(chatData.chat_id, chatData.user_id, chatData.chat_title, chatData.system_msg, new Date(chatData.creation_date), new Date(chatData.last_update));
                newChat.buildChatTree(chatData.chat_tree_roots, chatData.active_chat_index, chatData.chat_nodes);
                return newChat;
            });
        } else {
            console.error(APIRoutes.GET_CHAT, data);
            navigate(AppRoutes.HOME);
        }
    };

    const handleSubmit = async () => {
        const chatContext: { role: string, content: string }[] = chat.getChatContext();
        updateResponseLoadingStatus(true, userMessage.trim());

        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.SIGNED_CHAT}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                message: userMessage.trim(),
                model: currentModel,
                context: chatContext,
                parent_chat_node_id: chat.getActiveLeafChatNodeId(),
            })
        });

        const data = await response.json();
        updateResponseLoadingStatus(false, "");
        if (response.ok && data.status === 'success') {
            // const parent_chat_node_id = data.data.parent_chat_node_id;
            const last_update = data.data.last_update;
            chat.newLastUpdate(new Date(last_update));

            setChat(prevChat => {
                if (!prevChat) return prevChat; // If null, do nothing

                const _id = data.data.chat_node._id;
                const user_msg = data.data.chat_node.user_msg;
                const assistant_msg = data.data.chat_node.assistant_msg;
                const model_used = data.data.chat_node.model_used;
                const response_time = data.data.chat_node.response_time;
                const creation_date = data.data.chat_node.creation_date;

                prevChat.addConversationV2(_id, user_msg, assistant_msg, model_used, response_time, new Date(creation_date));
                // Manually create a new Chat instance to trigger re-render
                const newChat = new Chat(prevChat);
                return newChat; // React will now detect state change
            });
        }
        else {
            console.error(APIRoutes.SIGNED_CHAT, data);
        }

        scrollToBottonChatList()
    };


    const scrollToBottonChatList = () => {
        setShowScrollButton(false);
        const chatListDiv = document.getElementById("chat-list") as HTMLDivElement | null;
        chatListDiv?.scrollTo({ top: chatListDiv.scrollHeight, behavior: 'smooth' });
    };


    React.useEffect(() => {
        const chatListDiv = document.getElementById("chat-list");
        const scrollBtnOffset = 200;

        const handleScroll = () => {
            if (!chatListDiv) return;

            // Check if scrolled to bottom
            const isAtBottom = chatListDiv.scrollHeight - chatListDiv.scrollTop - scrollBtnOffset <= chatListDiv.clientHeight + 1;
            setShowScrollButton(!isAtBottom);
        };

        chatListDiv?.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => chatListDiv?.removeEventListener('scroll', handleScroll);
    }, []);

    React.useEffect(() => {
        getChatData();
    }, [chatId]);

    React.useEffect(() => {
        scrollToBottonChatList();
    }, [chat]);

    return (
        <>
            {loadingChatData && <Loading />}

            <div className="chat-ground-container">
                <div className="system-msg-container">
                    {(chat.system_msg !== "" && chat.system_msg !== null) &&
                        <div className="system-msg">
                            <b>System Message: </b>
                            <span> {chat.system_msg} </span>
                        </div>
                    }
                </div>

                <div className="chat-ground" id="chat-list">
                    <div className="chat-list" >
                        <ChatContainer chat={chat} loadingResponse={isResponseLoading} loadingUserMsg={responseLoadingUserMsg} />
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

export default ChatGround;
