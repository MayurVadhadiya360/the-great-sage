import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import ChatApp from './components/ChatApp';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Account from './components/Account';
import { ChatList } from './components/utils/ChatAlgos';

export enum APIRoutes {
    API_URL = '',

    LOGIN = '/login',
    SIGNUP = '/register',
    LOGOUT = '/logout',
    PROFILE = '/user-profile',
    DELETE_ACCOUNT = '/delete-account',

    GET_MODELS = '/get-models-list',
    CHAT_LIST = '/chat-list',
    CHAT = '/chat',
    ANONYMOUS_CHAT = '/anonymous-chat',
    SIGNED_CHAT = '/signed-chat',
    NEW_CHAT = '/new-chat',
    GET_CHAT = '/get-chat',
    UPDATE_CHAT_TITLE = '/update-chat-title',
    DELETE_CHAT = '/delete-chat',
}

export enum AppRoutes {
    HOME = "/",
    LOGIN = "/login",
    SIGNUP = "/signup",
    ACCOUNT = "/account",
    CHAT = "/chat",
};

export type UserProfile = {
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
    chatList: ChatList;
    setChatlist: React.Dispatch<React.SetStateAction<ChatList>>;
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
    const [chatList, setChatlist] = React.useState<ChatList>(new ChatList([]));

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
        if (response.ok && data.status === 'success') {
            setUserProfile({
                _id: data.data._id,
                username: data.data.username,
                email: data.data.email,
            });
        }
        else {
            setUserProfile(null);
            console.error(APIRoutes.PROFILE, data);
        }
    }


    const getChatList = async () => {
        // fetch chat list from server
        const response = await fetch(`${APIRoutes.API_URL}${APIRoutes.CHAT_LIST}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok && data.status === 'success') {
            let chatlist_data = data.data.chat_list;
            setChatlist(new ChatList(chatlist_data));
        } else {
            console.error(APIRoutes.CHAT_LIST, data);
        }
    };

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
            setUserProfile(null);
        }
        else {
            console.error(APIRoutes.LOGOUT, data);
        }
    }

    React.useEffect(() => {
        getModels();
        getUserProfile();
    }, []);

    React.useEffect(() => {
        if (userProfile) {
            getChatList();
        }
    }, [userProfile]);

    return (
        <>
            <AppContext.Provider value={{ userProfile, getUserProfile, logOut, llmModels, chatList, setChatlist }}>
                <Router>
                    <Routes>
                        <Route path={AppRoutes.HOME} element={<ChatApp />} />
                        <Route path={AppRoutes.LOGIN} element={<Login />} />
                        <Route path={AppRoutes.SIGNUP} element={<SignUp />} />

                        {userProfile &&
                            <>
                                <Route path={AppRoutes.ACCOUNT} element={<Account setUserProfile={setUserProfile} />} />
                                <Route path={`${AppRoutes.CHAT}/:chatId`} element={<ChatApp />} />
                            </>
                        }
                        {/* Redirect to Home if no route matches */}
                        <Route path="*" element={<Navigate to={AppRoutes.HOME} replace />} />

                        {/* OR Show a custom 404 page */}
                        {/* <Route path="*" element={<NotFoundPage />} /> */}
                    </Routes>
                </Router>
            </AppContext.Provider>
        </>
    );
};

export default App;
