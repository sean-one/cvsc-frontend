import React, { createContext, useReducer } from 'react';
import usersReducer, { USERS_INITIAL_STATE } from './users.reducer';
import userTypes from './users.types';

import { userSignIn, userUpdate } from './users.utils';

export const UsersContext = createContext({
    ...USERS_INITIAL_STATE
});

const UsersProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(usersReducer, USERS_INITIAL_STATE)
    const { userProfile, userRoles, userEvents } = store
    
    // used at sucessful login & successful registration
    const setProfile = (user_details) => {
        const user_roles = user_details.roles || []

        // remove roles from user details
        delete user_details['roles']

        // save user details to local storage
        userSignIn(user_details)
        
        // delete the token to avoid saving in context
        delete user_details['token']

        dispatch({
            type: userTypes.SET_PROFILE,
            payload: {
                user: user_details,
                roles: user_roles
            }
        })
    }

    const getBusinessRole = (business_id) => {
        const active_roles = userRoles.filter(role => role.active_role)
        console.log(active_roles)
        if(active_roles.length === 0) {
            // need to send an error
            console.log('user does not have active roles for this business')
            return
        }
        const business_role = active_roles.find(role => role.business_id === business_id)
        console.log(business_role)
        
        return business_role
    }

    const getBusinessRoleType = (business_id) => {
        const active_roles = userRoles.filter(role => role.active_role)
        if (active_roles.length === 0) {
            // send error
            return 'none'
        } else {
            const business_role = active_roles.find(role => role.business_id === business_id)
            
            if(business_role === undefined) {
                return 'none'
            } else {
                return business_role.role_type
            }
        }
    }

    const userRolesBusinessIds = () => {
        let business_ids = []

        userRoles.map(role => {
            return business_ids.push(role.business_id)
        })

        return business_ids
    }

    const userActiveRoles = () => {
        let business_ids = []
        const roles = userRoles.filter(role => role.active_role)
        
        roles.map(role => {
            return business_ids.push(role.business_id)
        })
        return business_ids
    }

    const userRolesBuinsessManagementIds = () => {
        let business_ids = []
        const roles = userRoles.filter(role => role.role_type === 'manager' || role.role_type === 'admin')

        roles.map(role => {
            return business_ids.push(role.business_id)
        })
        return business_ids
    }

    const addUserRole = (user_role) => {
        dispatch({
            type: userTypes.ADD_USER_ROLE,
            payload: user_role
        })
    }

    const removeUserRole = (business_id) => {
        dispatch({
            type: userTypes.REMOVE_USER_ROLE,
            payload: business_id
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
                setProfile,
                getBusinessRole,
                getBusinessRoleType,
                userRolesBusinessIds,
                userRolesBuinsessManagementIds,
                userActiveRoles,
                addUserRole,
                removeUserRole,
                updateUser,
                userSignOut,
                
                userProfile,
                userRoles,
                userEvents,
            }
        }>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider;