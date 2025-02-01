import React from 'react';
import upArrowIcon from '../../icons/up-arrow.svg';

const UserMsgField = () => {
    return (
        <>
            <div className='chat-input-container'>
                <textarea
                    className='user-message'
                    name="user-message"
                    id="user-message"
                    placeholder='Message The Great Sage'
                    rows={1}
                    onChange={(e) => {
                        let val_lines_count = e.target.value.split('\n').length;
                        if (val_lines_count < 7 && val_lines_count > 0) {
                            e.target.rows = val_lines_count;
                        }
                    }}
                />

                <div className='send-button'>
                    <img src={upArrowIcon} alt="submit" height='40px' width='40px' />
                </div>
            </div>
        </>
    );
};

export default UserMsgField;