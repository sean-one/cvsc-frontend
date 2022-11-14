import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ auth, setAuth ] = useState({})

    useEffect(() => {
        const stored_user = localStorage.getItem('user');
        console.log(stored_user)
        if (stored_user !== null) setAuth(JSON.parse(stored_user));
    }, []);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(auth));
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;