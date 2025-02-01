import React from 'react';
import '../css/chatground.css';

import UserMsgField from './chat_ground_comps/UserMsgField';
import ChatContainer from './chat_ground_comps/ChatContainer';

const ChatGround = () => {
    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
            }}>
                <div style={{
                    maxWidth: '50rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 0',
                }}>

                    <div style={{ flex: 1 }}>
                        chat
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque nihil eaque qui nostrum, assumenda excepturi dolores recusandae quisquam fugiat labore, numquam ad. Voluptas rerum eos tempore cum aliquam vel est natus ipsam quo minima consequuntur perspiciatis quaerat eveniet blanditiis corrupti, libero similique doloribus non in ex! Harum asperiores possimus doloremque.
                    </div>
                    <ChatContainer />

                    <UserMsgField />
                </div>
            </div>
        </>
    );
}

export { ChatGround };
