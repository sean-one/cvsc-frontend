import React, { createContext, useReducer } from 'react';
import usersReducer, { USERS_INITIAL_STATE } from './users.reducer';
import userTypes from './users.types';

import { userSignIn, userUpdate, userContactUpdate } from './users.utils';

export const UsersContext = createContext({
    ...USERS_INITIAL_STATE
});


const UsersProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(usersReducer, USERS_INITIAL_STATE)
    const { userProfile, userRoles, editorRoles, adminRoles, userContact, businessRoles, pendingRequestList } = store

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

    const useBusinessRoles = () => {
        return businessRoles.filter(roles => roles.user_id !== userProfile.id);
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

    // used on rolestab after successful pending req get
    const setPendingRequestList = pendingrequests => {
        dispatch({
            type: userTypes.GET_PENDING_REQUEST_OK,
            payload: pendingrequests
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

    const setBusinessRoles = businessRoles => {
        dispatch({
            type: userTypes.GET_BUSINESS_ROLES,
            payload: businessRoles
        })
    }

    const getFromLocal = userdata => {
        dispatch({
            type: userTypes.UPDATE_FROM_LOCAL,
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
                setUserRoles,


                userProfile,
                userContact,
                pendingRequestList,
                updateUserContact,
                setPendingRequestList,
                updateUser,
                useAdminRoles,
                useBusinessIdRoles,
                useBusinessRoles,
                isEditor,
                setBusinessRoles,
                getFromLocal,
                userSignOut
            }
        }>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider;