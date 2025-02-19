import React from 'react';
import profileIcon from '../icons/account_circle_200.svg';
import userIcon from '../icons/user_dark.svg';
import mailIcon from '../icons/mail_dark.svg';
import deleteIcon from '../icons/delete-bin.svg';
import ProfileField from './auth/ProfileField';
import { useAppContext } from '../App';


const Account: React.FC = () => {
    const { userProfile } = useAppContext();

    return (
        <>
            <div className='auth-container'>

                <div className='profile-container'>
                    <img src={profileIcon} alt="profile" />
                    <ProfileField icon={userIcon} label={userProfile?.username || ""} />
                    <ProfileField icon={mailIcon} label={userProfile?.email || ""} />

                    <button
                        className='account-delete-btn'
                        onClick={() => console.log('delete account button clicked!')}
                    >
                        <img src={deleteIcon} alt="delete" height='24px' width='24px' />
                        <span>Delete Account</span>
                    </button>
                </div>

            </div>
        </>
    );
};

export default Account;