import React, { createContext, useReducer } from 'react';
import usersReducer, { USERS_INITIAL_STATE } from './users.reducer';


export const UsersContext = createContext({
    ...USERS_INITIAL_STATE
});


const UsersProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(usersReducer, USERS_INITIAL_STATE)
    const { userProfile } = store

    return (
        <UsersContext.Provider value={{ userProfile, dispatch }}>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider;