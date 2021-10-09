import React, { createContext, useReducer } from 'react';
import usersReducer, { USERS_INITIAL_STATE } from './users.reducer';
import userTypes from './users.types';


export const UsersContext = createContext({
    ...USERS_INITIAL_STATE
});


const UsersProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(usersReducer, USERS_INITIAL_STATE)
    const { userProfile, userRoles, pendingRequestList } = store

    const useAdminRoles = () => {
        const userAdmin = userRoles.filter(role => role.roletype === 'admin')
        let adminArr = []
        userAdmin.map(row => {
            return adminArr.push(row.business_id)
        })
        // returns an array of business_ids that user has admin rights to
        return adminArr
    }
    
    // const useCreatorRoles = () => {
    //     const userCreator = userRoles.filter(role => role.roletype === 'creator')
    //     let creatorArr = []
    //     userCreator.map(row => {
    //         creatorArr.push(row.business_id)
    //     })
    //     // returns an array of business_ids that user has creator rights to
    //     return creatorArr;
    // }

    const setUserProfile = userdata => {
        dispatch({
            type: userTypes.SIGNIN_SUCCESS,
            payload: userdata
        })
    }

    const setUserRoles = roledata => {
        dispatch({
            type: userTypes.GET_USER_ROLES_OK,
            payload: roledata
        })
    }

    const setPendingRequestList = pendingrequests => {
        dispatch({
            type: userTypes.GET_PENDING_REQUEST_OK,
            payload: pendingrequests
        })
    }

    const getFromLocal = userdata => {
        dispatch({
            type: userTypes.UPDATE_FROM_LOCAL,
            payload: userdata
        })
    }

    return (
        <UsersContext.Provider value={
            {
                userProfile,
                userRoles,
                pendingRequestList,
                setUserProfile,
                setUserRoles,
                setPendingRequestList,
                useAdminRoles,
                getFromLocal
            }
        }>
            {children}
        </UsersContext.Provider>
    )
}

export default UsersProvider;