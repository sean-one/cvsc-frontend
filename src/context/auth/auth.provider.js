import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ auth, setAuth ] = useState(null)
    const isLoggedIn = auth != null;
    let navigate = useNavigate()

    const sendToLogin = () => {
        localStorage.removeItem('jwt')
        setAuth(null)
        navigate('/login')
    }

    // logout_user
    const user_logout = () => {
        localStorage.removeItem('jwt')
        setAuth(null)
        navigate('/')
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, isLoggedIn, sendToLogin, user_logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;