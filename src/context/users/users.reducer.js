import userTypes from './users.types';

export const USERS_INITIAL_STATE = {
    userProfile: {},
    userRoles: [],
    userContact: {},
    pendingRequestList: [],
    businessRoles: []
};

const usersReducer = (state, action) => {
    switch(action.type) {
        case userTypes.SIGNIN_SUCCESS:
            return {
                ...state,
                userProfile: action.payload.user,
                userContact: action.payload.contact
            };
        case userTypes.UPDATE_FROM_LOCAL:
            return {
                ...state,
                userProfile: action.payload
            };
        case userTypes.UPDATE_USER:
            return {
                ...state,
                userProfile: action.payload
            }
        case userTypes.UPDATE_USER_CONTACT:
            return {
                ...state,
                userContact: action.payload
            }
        case userTypes.GET_USER_ROLES_OK:
            return {
                ...state,
                userRoles: action.payload
            };
        case userTypes.GET_BUSINESS_ROLES:
            return {
                ...state,
                businessRoles: action.payload
            }
        case userTypes.GET_PENDING_REQUEST_OK:
            return {
                ...state,
                pendingRequestList: action.payload
            }
        case userTypes.USER_LOGOUT:
            return {
                ...USERS_INITIAL_STATE
            }
        default:
            throw new Error(`unhandled type: ${action.type}`)
            // return state;
    }
};

export default usersReducer;