import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ auth, setAuth ] = useState({})
    let navigate = useNavigate()

    const logout_user = () => {
        localStorage.removeItem('jwt')
        setAuth({})
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout_user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;