import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import ChatApp from './components/ChatApp';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Account from './components/Account';

export enum APIRoutes {
    API_URL = 'http://localhost:8000',

    LOGIN = '/login',
    SIGNUP = '/register',
    LOGOUT = '/logout',
    PROFILE = '/user-profile',

    GET_MODELS = '/get-models-list',
    CHAT_LIST = '/chat-list',
    CHAT = '/chat',
    UNSIGNED_CHAT = '/unsigned-chat',
    NEW_CHAT = '/new-chat',
    GET_CHAT = '/get-chat',
}

export enum AppRoutes {
    HOME = "/",
    LOGIN = "/login",
    SIGNUP = "/signup",
    ACCOUNT = "/account",
    CHAT = "/chat",
};

type UserProfile = {
    _id: string;
    username: string;
    email: string;
};

type LLM_Model = {
    provider: string;
    models: string[];
};

interface AppContextProps {
    userProfile: UserProfile | null;
    getUserProfile: () => Promise<void>;
    logOut: () => Promise<void>;
    llmModels: LLM_Model[];
}

const AppContext = React.createContext<AppContextProps | undefined>(undefined);

// Custom Hook for using AppContext
export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context;
};

const App: React.FC = () => {
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
    const [llmModels, setLlmModels] = React.useState<LLM_Model[]>([]);

    const getModels = async () => {
        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.GET_MODELS}`);
        const data = await response.json();
        setLlmModels(data);
    };

    const getUserProfile = async () => {
        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.PROFILE}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (response.ok) {
            setUserProfile({
                _id: data.data._id,
                username: data.data.username,
                email: data.data.email,
            });
        }
        else {
            setUserProfile(null);
            console.error(data);
        }
    }

    const logOut = async () => {
        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.LOGOUT}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data);
            setUserProfile(null);
        }
        else {
            console.error(data);
        }
    }

    const initLoad = async () => {
        await getModels();
        await getUserProfile();
    }

    React.useEffect(() => {
        initLoad();
    }, []);

    React.useEffect(() => {
        console.log('Updated llmModels:', llmModels);
    }, [llmModels]);

    React.useEffect(() => {
        console.log('User Profile:', userProfile);
    }, [userProfile]);

    return (
        <>
            <AppContext.Provider value={{ userProfile, getUserProfile, logOut, llmModels }}>
                <Router>
                    <Routes>
                        <Route path={AppRoutes.HOME} element={<ChatApp />} />
                        <Route path={AppRoutes.LOGIN} element={<Login />} />
                        <Route path={AppRoutes.SIGNUP} element={<SignUp />} />

                        {userProfile &&
                            <>
                                <Route path={AppRoutes.ACCOUNT} element={<Account />} />
                                <Route path={`${AppRoutes.CHAT}/:chatId`} element={<ChatApp />} />
                            </>
                        }
                    </Routes>
                </Router>
            </AppContext.Provider>
        </>
    );
};

export default App;
