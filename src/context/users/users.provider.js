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

    // sets the userroles object used to figure out account type
    const setUserRoles = userroles => {
        dispatch({
            type: userTypes.SET_USER_ROLES,
            payload: userroles
        })
    }

    const setAccountType = () => {
        // remove roles not approved
        const active_roles = userRoles.filter(role => role.active_role)
        // if no roles account is basic
        if (active_roles.length === 0) {
            return 'basic'
        } else {
            if(active_roles.find(role => role.role_type === 'admin')) {
                return 'admin'
            } else if(active_roles.find(role => role.role_type === 'manager')) {
                return 'manager'
            } else {
                return 'creator'
            }
        }
    }

    const filterBusinessByCurrentRoles = (business_list) => {
        let business_ids = []
        let business_list_filtered = business_list
        
        // filter out active roles only
        const active_roles = userRoles.filter(role => role.active_role)

        active_roles.map(role => {
            return business_ids.push(role.business_id)
        })
        
        if(business_ids.length > 0) {
            business_list_filtered = business_list_filtered.filter(business => !business_ids.includes(business.id))
        }
        
        return business_list_filtered
    }

    const useBusinessRole = (business_id) => {
        return userRoles.find(role => role.business_id === business_id)
    }

    const useRoleBusinessIds_All = () => {
        let business_ids = []
        userRoles.map(role => {
            return business_ids.push(role.business_id)
        })
        return business_ids
    }

    const useRoleBusinessIds_Active = () => {
        let business_ids = []
        const roles = userRoles.filter(role => role.active_role)
        
        roles.map(role => {
            return business_ids.push(role.business_id)
        })
        return business_ids
    }

    const useRoleBuinsessIds_Management = () => {
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
                setAccountType,
                filterBusinessByCurrentRoles,
                useBusinessRole,
                addUserRole,
                removeUserRole,
                userRoles,
                
                userProfile,
                updateUser,
                useRoleBuinsessIds_Management,
                useRoleBusinessIds_All,
                useRoleBusinessIds_Active,
                useBusinessAdminIdRoles,
                userSignOut
            }
        }>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider;