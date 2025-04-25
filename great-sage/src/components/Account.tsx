import React from 'react';
import profileIcon from '../icons/account_circle_200.svg';
import userIcon from '../icons/user_dark.svg';
import mailIcon from '../icons/mail_dark.svg';
import deleteIcon from '../icons/delete-bin.svg';
import upArrowIcon from '../icons/up-arrow.svg';
import ProfileField from './auth/ProfileField';
import { APIRoutes, AppRoutes, useAppContext, UserProfile } from '../App';
import { useNavigate } from 'react-router-dom';
import Loading from './utils/Loading';

type AccountProps = {
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const Account: React.FC<AccountProps> = ({ setUserProfile }) => {
    const navigate = useNavigate();
    const { userProfile } = useAppContext();
    const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);

    const updateDeleteLoading = (isLoading: boolean) => {
        setIsDeleteLoading(isLoading);
    };

    const deleteAccount = async () => {
        updateDeleteLoading(true);

        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.DELETE_ACCOUNT}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        updateDeleteLoading(false);
        if (response.ok && data.status === 'success') {
            setUserProfile(null);
            navigate(`${AppRoutes.HOME}`);
        }
        else {
            console.error(APIRoutes.DELETE_ACCOUNT, data);
        }
    };

    return (
        <>
            {isDeleteLoading && <Loading />}
            <div className='auth-container'>

                <div className='profile-container'>
                    <div className='back-to-home' onClick={(e) => navigate(-1)}>
                        <img src={upArrowIcon} alt='submit' height='40px' width='40px' />
                    </div>
                    <img src={profileIcon} alt="profile" />
                    <ProfileField icon={userIcon} label={userProfile?.username || ""} />
                    <ProfileField icon={mailIcon} label={userProfile?.email || ""} />

                    <button
                        className='account-delete-btn'
                        onClick={(e) => deleteAccount()}
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