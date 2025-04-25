import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../css/auth.css';
import mailIcon from '../icons/mail_light.svg';
import lockIcon from '../icons/lock_light.svg';
import { AppRoutes, APIRoutes, useAppContext } from '../App';
import TextInputField, { InputType } from './auth/TextInputField';
import Loading from './utils/Loading';


const Login: React.FC = () => {
    const navigate = useNavigate();

    const { getUserProfile } = useAppContext();
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const updateLoadingState = (loading: boolean) => {
        setIsLoading(loading);
    };

    const handleLogin = async () => {
        updateLoadingState(true);

        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.LOGIN}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok && data.status === 'success') {
            await getUserProfile();
            updateLoadingState(false);
            navigate(AppRoutes.HOME);
        }
        else {
            updateLoadingState(false);
            console.warn(APIRoutes.LOGIN, data);
        }
    };

    return (
        <>
            {isLoading && <Loading />}

            <div className='auth-container'>
                <div className='auth-form'>

                    <h1 className='auth-title'>Login</h1>

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

                    <button className='form-button' onClick={(e) => handleLogin()}>
                        Login
                    </button>

                    <div className='form-footer'>
                        <p>
                            Don't have an account? <Link to={AppRoutes.SIGNUP} className='link'>Sign up</Link>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Login;