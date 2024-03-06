import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useNotification from '../../hooks/useNotification';

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ auth, setAuth ] = useState(null)
    const { dispatch } = useNotification();
    const isLoggedIn = auth != null;
    let navigate = useNavigate()

    const user_reset = () => {
        // remove expired or bad token
        localStorage.removeItem('jwt')
        // reset auth
        setAuth(null)
    }

    const sendToLogin = () => {
        localStorage.removeItem('jwt')
        setAuth(null)
        navigate('/login')
    }

    // logout_user
    const user_logout = () => {
        localStorage.removeItem('jwt')
        setAuth(null)
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'SUCCESS',
                message: 'successful user logout'
            }
        });
        
        navigate('/')
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, isLoggedIn, sendToLogin, user_logout, user_reset }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;