import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/auth.css';
import mailIcon from '../icons/mail_light.svg';
import lockIcon from '../icons/lock_light.svg';
import userIcon from '../icons/user_light.svg';
import { APIRoutes, AppRoutes, useAppContext } from '../App';
import TextInputField, { InputType } from './auth/TextInputField';


const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const { getUserProfile } = useAppContext();
    const [username, setUsername] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const handleSignUp = async () => {
        console.log(username, email, password);
        console.log('sign up');

        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.SIGNUP}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            await getUserProfile();
            navigate(AppRoutes.HOME);
        }
        else {
            const data = await response.json();
            console.warn(data);
        }
    };

    return (
        <>
            <div className='auth-container'>
                <div className='auth-form'>

                    <h1 className='auth-title'>Sign Up</h1>

                    <TextInputField
                        type={InputType.TEXT}
                        prefixIcon={userIcon}
                        text={username}
                        setText={setUsername}
                        placeholderText='Username'
                    />

                    <TextInputField
                        type={InputType.EMAIL}
                        prefixIcon={mailIcon}
                        text={email}
                        setText={setEmail}
                        placeholderText='Email'
                    />

                    <TextInputField
                        type={InputType.PASSWORD}
                        prefixIcon={lockIcon}
                        text={password}
                        setText={setPassword}
                        placeholderText='Password'
                    />


                    <button className='form-button' onClick={(e) => handleSignUp()}>
                        Sign Up
                    </button>

                    <div className='form-footer'>
                        <p>
                            Already have an account? <Link to={AppRoutes.LOGIN} className='link'>Login</Link>
                        </p>
                    </div>
                </div>
            </div>

        </>
    );
};

export default SignUp;