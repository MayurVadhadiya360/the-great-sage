import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../../css/chatground.css';
import editIcon from '../../icons/edit-pen.svg';
import checkIcon from '../../icons/check.svg';
import UserMsgField from './UserMsgField';
import ChatContainer from './ChatContainer';
import { Chat, ChatNode } from '../utils/ChatAlgos';
import { API_URL, APIRoutes } from '../../App';

type ChatGroundProps = {
    chatId: string | null;
};

const ChatGround: React.FC<ChatGroundProps> = ({ chatId }) => {
    const [isPending, startTransition] = React.useTransition();

    const [userMessage, setUserMessage] = React.useState<string>("");
    const [currentModel, setCurrentModel] = React.useState<string>("deepseek-r1-distill-llama-70b");

    const [chat, setChat] = React.useState<Chat | null>(null);

    const [systemMsg, setSystemMsg] = React.useState<string>("");
    const [systemMsgEditing, setSystemMsgEditing] = React.useState<boolean>(false);

    React.useEffect(() => {
        console.log(chat);
    }, [chat]);

    const handleSubmit = async () => {
        if (chat === null) {
            setChat(new Chat(
                "chatId",
                "user1",
                "free_chat",
                systemMsg.trim() || null,
                new Date(),
                new Date(),
            ));
        }

        let context: { role: string, content: string }[] = [
            // {
            //     'role': 'user',
            //     'content': userMessage.trim(),
            // }
        ];



        const response = await fetch(`${API_URL}${APIRoutes.UNSIGNED_CHAT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: currentModel,
                message: userMessage.trim(),
                context: context,
            })
        });

        const data = await response.json();
        if (response.ok) {
            const resMsg = data.data.response;
            const newChatNode = new ChatNode(
                uuidv4(),
                2,
                userMessage.trim(),
                resMsg,
                currentModel,
                new Date(),
                200,
                "parent",
            );
            setChat(prevChat => {
                if (!prevChat) return prevChat; // If null, do nothing

                // Manually create a new Chat instance to trigger re-render
                const newChat = new Chat(
                    prevChat._id,
                    prevChat.user_id,
                    prevChat.chat_title,
                    prevChat.system_msg,
                    prevChat.creation_time,
                    prevChat.last_activity
                );

                // Copy previous chat tree
                newChat.chat_tree_roots = [...prevChat.chat_tree_roots];

                if (newChat.chat_tree_roots.length === 0) {
                    newChat.addRootNode(newChatNode);
                } else {
                    newChat.addConversation(newChatNode);
                }

                return newChat; // React will now detect state change
            });
        }
        else {
            console.error(APIRoutes.UNSIGNED_CHAT, data);
        }

        console.log(data);
        // chat?.addRootNode()
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

    return (
        <div className="chat-ground-container">
            <div className="system-msg-container">
                {((chat === null) || (systemMsg !== "")) &&
                    <div className="system-msg">
                        {(chat === null) && (
                            <div
                                className="system-msg-edit-btn"
                                onClick={(e) => handleSystemMsgChange()}
                            >
                                <img src={systemMsgEditing ? checkIcon : editIcon} height='20px' width='20px' />
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

            <div className="chat-ground">
                <div className="chat-list">
                    <ChatContainer chat={chat} />
                </div>
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

export default ChatGround;
