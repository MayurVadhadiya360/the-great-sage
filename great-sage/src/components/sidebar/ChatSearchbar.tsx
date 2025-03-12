import React from 'react';
import searchIcon from '../../icons/search.svg';

interface ChatSearchbarProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const ChatSearchbar: React.FC<ChatSearchbarProps> = ({searchQuery, setSearchQuery}) => {
    return (
        <div className='chat-search-container'>
            <img src={searchIcon} alt="search-icon" height={30} />
            <input
                type="text"
                name="chat-search"
                id="chat-search"
                placeholder="Search chat"
                className="chat-search"
                value={searchQuery}
                autoComplete="off"
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
};

export default ChatSearchbar;
