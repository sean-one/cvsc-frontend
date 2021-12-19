import userAdminTypes from "./adminuser.types";

export const USER_ADMIN_INITIAL_STATE = {
    pendingBusinessRequest: {}
}

const userAdminReducer = (state, action) => {
    switch(action.type) {
        case userAdminTypes.SET_PENDING_BUSINESSES:
            return {
                ...state,
                pendingBusinessRequest: action.payload
            };
        default:
            throw new Error(`unhandled type: ${action.type}`)
    }
}

export default userAdminReducer;