import React, { createContext, useReducer } from 'react';
import rolesReducer, { ROLES_INITIAL_STATE } from './roles.reducer';
import roleTypes from './roles.types';


export const RolesContext = createContext({
    ...ROLES_INITIAL_STATE
});

const RolesProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(rolesReducer, ROLES_INITIAL_STATE)
    const { userRoles, editorRoles, adminRoles, isAdmin, isEditor } = store

    const setUserRoles = roles => {
        dispatch({
            type: roleTypes.SET_USER_ROLES,
            payload: roles
        })
    }

    const roleReset = () => {
        console.log('clearing role')
        dispatch({
            type: roleTypes.ROLE_RESET
        })
    }

    return (
        <RolesContext.Provider value={
            {
                userRoles,
                editorRoles,
                adminRoles,
                isAdmin,
                isEditor,
                setUserRoles,
                roleReset
            }
        }>
            {children}
        </RolesContext.Provider>
    )
}

export default RolesProvider;