import React from 'react';
import upArrowIcon from '../../icons/up-arrow.svg';

const UserMsgField: React.FC = () => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const valLinesCount = e.target.value.split('\n').length;
    if (valLinesCount < 7 && valLinesCount > 0) {
      e.target.rows = valLinesCount;
    }
  };

  return (
    <div className='chat-input-container'>
      <textarea
        className='user-message'
        name='user-message'
        id='user-message'
        placeholder='Message The Great Sage'
        rows={1}
        onChange={handleChange}
      />
      <div className='send-button'>
        <img src={upArrowIcon} alt='submit' height='40px' width='40px' />
      </div>
    </div>
  );
};

export default UserMsgField;
