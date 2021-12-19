import React, { createContext, useReducer } from "react";
import userAdminReducer, { USER_ADMIN_INITIAL_STATE } from "./adminuser.reducer";
import userAdminTypes from "./adminuser.types";

export const UserAdminContext = createContext({
    ...USER_ADMIN_INITIAL_STATE
})

const UserAdminProvider = ({ children }) => {
    const [store, dispatch ] = useReducer(userAdminReducer, USER_ADMIN_INITIAL_STATE)
    const { pendingBusinessRequest } = store

    const setPendingBusinessRequestList = businessList => {
        dispatch({
            type: userAdminTypes.SET_PENDING_BUSINESSES,
            payload: businessList
        })
    }

    return (
        <UserAdminContext.Provider value={
            {
                pendingBusinessRequest,
                setPendingBusinessRequestList
            }
        }>
            {children}
        </UserAdminContext.Provider>
    )
}

export default UserAdminProvider;