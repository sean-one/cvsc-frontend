import React, { createContext, useReducer } from 'react';
import usersReducer, { USERS_INITIAL_STATE } from './users.reducer';
import userTypes from './users.types';

import { userSignIn, userUpdate, userContactUpdate } from './users.utils';

export const UsersContext = createContext({
    ...USERS_INITIAL_STATE
});


const UsersProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(usersReducer, USERS_INITIAL_STATE)
    const { userProfile, userRoles, editorRoles, adminRoles, userContact } = store

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
        const editorRoles = userroles.filter(role => role.role_type === 'creator')
        const adminRoles = userroles.filter(role => role.role_type === 'admin')
        dispatch({
            type: userTypes.SET_USER_ROLES,
            payload: { userroles, adminRoles, editorRoles }
        })
    }

    const useAdminRoles = () => {
        const userAdmin = userRoles.filter(role => role.roletype === 'admin')
        let adminArr = []
        userAdmin.map(row => {
            return adminArr.push(row.business_id)
        })
        // returns an array of business_ids that user has admin rights to
        return adminArr
    }

    const useBusinessIdRoles = () => {
        let businessIdList = []
        userRoles.map(role => {
            return businessIdList.push(role.business_id)
        })
        return businessIdList
    }

    const isEditor = () => {
        if (userRoles.length > 0) {
            return true;
        } else {
            return false
        }
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
                editorRoles,
                adminRoles,
                userRoles,
                setUserRoles,


                userProfile,
                userContact,
                updateUserContact,
                updateUser,
                useAdminRoles,
                useBusinessIdRoles,
                isEditor,
                userSignOut
            }
        }>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider;