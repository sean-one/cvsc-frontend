import React, { createContext, useReducer } from 'react';
import rolesReducer, { ROLES_INITIAL_STATE } from './roles.reducer';
import roleTypes from './roles.types';

export const RolesContext = createContext({
    ...ROLES_INITIAL_STATE
});

const RolesProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(rolesReducer, ROLES_INITIAL_STATE)
    const { userRoles, businessRoles } = store

    const setRoles = userroles => {
        // const creatorRoles = userroles.filter(role => role.role_type === 'creator')
        // const adminRoles = userroles.filter(roles => role.role_type === 'admin')
        dispatch({
            type: roleTypes.SET_ROLES,
            payload: userroles
        })
    }

    const isCreatorAccount = () => {
        const c_roles = userRoles.filter(role => role.role_type === 'creator')
        if(c_roles.length === 0) {
            return false
        } else {
            return true
        }
    }

    const isAdminAccount = () => {
        const a_roles = userRoles.filter(role => role.role_type === 'admin')
        if(a_roles.length === 0) {
            return false
        } else {
            return true
        }
    }

    const setAllBusinessRoles = (data) => {
        dispatch({
            type: roleTypes.SET_BUSINESS_ROLES,
            payload: data
        })
    }

    const useCreatorRoles = () => {
        return userRoles.filter(role => role.role_type === 'creator')
    }

    const useAdminRoles = () => {
        return userRoles.filter(role => role.role_type === 'admin')
    }

    // returns an array of active_role for business admin (edit business roles tab)
    const useCurrentRoles = () => {
        return businessRoles.filter(role => role.active_role === true)
    }

    // returns an array of active_role=false for business admin (pending request tab)
    const usePendingRoles = () => {
        return businessRoles.filter(role => role.active_role === false)
    }

    const roleReset = () => {
        dispatch({
            type: roleTypes.ROLES_RESET,
        })
    }

    return (
        <RolesContext.Provider value={
            {
                userRoles,
                setRoles,
                isCreatorAccount,
                isAdminAccount,
                setAllBusinessRoles,
                useCreatorRoles,
                useAdminRoles,
                useCurrentRoles,
                usePendingRoles,
                roleReset
            }
        }>
            {children}
        </RolesContext.Provider>
    )
}

export default RolesProvider;