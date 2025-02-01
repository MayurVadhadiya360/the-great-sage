import React from 'react';
import searchIcon from '../../icons/search.svg';

const ChatSearchbar = () => {
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0 .5rem',
                    backgroundColor: '#3F3F3F',
                    height: '50px',
                    borderRadius: '10px',
                }}
            >
                <img src={searchIcon} alt="search-icon" height='30px' />
                <input type="text" name="chat-search" id="chat-search" placeholder='Search chat'
                    style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        fontSize: '24px',
                        width: '80%',
                        border: 'none',
                        outline: 'none',
                    }}
                />
            </div>

        </>
    );
};

export { ChatSearchbar };