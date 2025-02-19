import React from 'react';
import Tooltip from '../utils/Tooltip';

interface ProfileFieldProps {
    icon: string;
    label: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label }) => {
    return (
        <>
            <div className='profile-field'>
                <div className='profile-field-icon'>
                    <img src={icon} alt="icon" height={'24px'} width={'24px'} />
                </div>
                <div className='profile-field-value'>
                    <Tooltip text={label}>
                        <span>{label}</span>
                    </Tooltip>
                </div>

            </div>
        </>
    );
};

export default ProfileField;