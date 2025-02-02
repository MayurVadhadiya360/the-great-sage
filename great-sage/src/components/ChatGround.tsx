import React from 'react';
import '../css/chatground.css';
import UserMsgField from './chat_ground_comps/UserMsgField';
import ChatContainer from './chat_ground_comps/ChatContainer';

class ChatGround extends React.Component {
    render() {
        return (
            <div className='chat-ground-container'>
                <div className='chat-ground'>
                    <div className='chat-list'>
                        <ChatContainer />
                    </div>

                    <div style={{ width: '100%', marginTop: '1rem', minWidth:'300px'}}>
                        <UserMsgField />
                    </div>

                </div>
            </div>
        );
    }
}

export { ChatGround };
