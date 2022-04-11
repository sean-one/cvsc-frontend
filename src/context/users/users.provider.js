import React, { createContext, useReducer } from 'react';
import usersReducer, { USERS_INITIAL_STATE } from './users.reducer';
import userTypes from './users.types';

import { userSignIn, userUpdate, userContactUpdate, findCreatorRights, findAdminRights } from './users.utils';

export const UsersContext = createContext({
    ...USERS_INITIAL_STATE
});


const UsersProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(usersReducer, USERS_INITIAL_STATE)
    const { userProfile, userRoles, userContact, isCreator, isAdmin } = store

    // used at sucessful login & successful registration
    const setUser = userdata => {
        // set up local storage
        // also cleans data for the payload object
        userSignIn(userdata)

        dispatch({
            type: userTypes.SET_USER,
            payload: { user: userdata.user, contact: userdata.contact }
        })
    }

    const setUserRoles = userroles => {
        const creatorrights = findCreatorRights(userroles)
        const adminrights = findAdminRights(userroles)
        dispatch({
            type: userTypes.SET_USER_ROLES,
            payload: { userroles, creatorrights, adminrights }
        })
    }

    const useBusinessIdRoles = () => {
        let businessIdList = []
        userRoles.map(role => {
            return businessIdList.push(role.business_id)
        })
        return businessIdList
    }

    // used at contactSection updateContact
    const updateUserContact = contact => {
        // save contact to local storage
        userContactUpdate(contact)
        dispatch({
            type: userTypes.UPDATE_USER_CONTACT,
            payload: contact
        })
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
                isCreator,
                isAdmin,


                userProfile,
                userContact,
                updateUserContact,
                updateUser,
                useBusinessIdRoles,
                userSignOut
            }
        }>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider;