import React, { createContext, useReducer } from 'react';
import usersReducer, { USERS_INITIAL_STATE } from './users.reducer';
import userTypes from './users.types';

import { userSignIn, userUpdate } from './users.utils';

export const UsersContext = createContext({
    ...USERS_INITIAL_STATE
});


const UsersProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(usersReducer, USERS_INITIAL_STATE)
    const { userProfile, userRoles } = store

    // used at sucessful login & successful registration
    const setUser = userdata => {
        // set up local storage and cleans data payload object
        userSignIn(userdata)

        dispatch({
            type: userTypes.SET_USER,
            payload: userdata.user
        })
    }

    // sets the userroles object and set the creator and admin rights
    const setUserRoles = userroles => {
        dispatch({
            type: userTypes.SET_USER_ROLES,
            payload: userroles
        })
    }

    // creates an array of business_id with both 'creator' and 'admin'
    // used in useBusinessFilter hook
    const useBusinessIdRoles = () => {
        let businessIdList = []
        userRoles.map(role => {
            return businessIdList.push(role.business_id)
        })
        return businessIdList
    }

    // creates an array of business_id with 'admin' rights
    const useBusinessAdminIdRoles = () => {
        let businessAdminIdList = []
        const userAdminRoles = userRoles.filter(role => role.role_type === 'admin')
        userAdminRoles.map(a_role => {
            return businessAdminIdList.push(a_role.business_id)
        })
        return businessAdminIdList
    }

    // used after successful avatar update
    const updateUser = userdata => {
        userUpdate(userdata)

        dispatch({
            type: userTypes.UPDATE_USER,
            payload: userdata
        })
    }

    const userSignOut = () => {
        dispatch({
            type: userTypes.USER_LOGOUT
        })
    }

    return (
        <UsersContext.Provider value={
            {
                setUser,
                setUserRoles,


                userProfile,
                updateUser,
                useBusinessIdRoles,
                useBusinessAdminIdRoles,
                userSignOut
            }
        }>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider;