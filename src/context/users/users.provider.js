import React, { createContext, useReducer } from 'react';
import usersReducer, { USERS_INITIAL_STATE } from './users.reducer';
import userTypes from './users.types';


export const UsersContext = createContext({
    ...USERS_INITIAL_STATE
});


const UsersProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(usersReducer, USERS_INITIAL_STATE)
    const { userProfile, userEvents } = store

    const setUserProfile = userdata => {
        dispatch({
            type: userTypes.SIGNIN_SUCCESS,
            payload: userdata
        })
    }

    const setUserEvents = eventdata => {
        dispatch({
            type: userTypes.GET_USER_EVENTS,
            payload: eventdata
        })
    }

    const getFromLocal = userdata => {
        dispatch({
            type: userTypes.UPDATE_FROM_LOCAL,
            payload: userdata
        })
    }

    const deleteEvent = eventId => {
        dispatch({
            type: userTypes.DELETE_EVENT,
            payload: eventId
        })

    }

    return (
        <UsersContext.Provider value={{ userProfile, setUserProfile, userEvents, setUserEvents, getFromLocal, deleteEvent }}>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider;