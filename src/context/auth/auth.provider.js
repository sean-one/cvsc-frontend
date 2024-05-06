import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ auth, setAuth ] = useState(null)
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


    return (
        <AuthContext.Provider value={{ auth, setAuth, isLoggedIn, sendToLogin, user_reset }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;