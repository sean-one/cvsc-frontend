import React, { createContext, useState } from 'react';


export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ auth, setAuth ] = useState({})

    // const addRole = (new_role) => {

    // }

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;