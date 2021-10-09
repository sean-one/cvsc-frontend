import userTypes from './users.types';
import { createLocalUser } from './users.utils';

export const USERS_INITIAL_STATE = {
    userProfile: {},
    userRoles: [],
    pendingRequestList: []
};

const usersReducer = (state, action) => {
    switch(action.type) {
        case userTypes.SIGNIN_SUCCESS:
            createLocalUser(action.payload)
            return {
                ...state,
                userProfile: action.payload
            };
        case userTypes.UPDATE_FROM_LOCAL:
            return {
                ...state,
                userProfile: action.payload
            };
        case userTypes.GET_USER_ROLES_OK:
            return {
                ...state,
                userRoles: action.payload
            };
        case userTypes.GET_PENDING_REQUEST_OK:
            return {
                ...state,
                pendingRequestList: action.payload
            }
        default:
            throw new Error(`unhandled type: ${action.type}`)
            // return state;
    }
};

export default usersReducer;