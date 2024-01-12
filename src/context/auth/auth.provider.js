import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ auth, setAuth ] = useState(null)
    const [ redirectPath, setRedirectPath ] = useState(null)
    const isLoggedIn = auth != null;
    let navigate = useNavigate()

    useEffect(() => {
        if (redirectPath) {
            navigate(redirectPath);
            setRedirectPath(null)
        }
    }, [redirectPath, navigate])

    const sendToLogin = () => {
        localStorage.removeItem('jwt')
        setAuth(null)
        setRedirectPath('/login')
        // navigate('/login')
    }
    // logout_user
    const user_logout = () => {
        // localStorage.removeItem('jwt')
        localStorage.clear()
        setAuth(null)
        setRedirectPath('/')
        // navigate('/')
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, isLoggedIn, sendToLogin, user_logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;