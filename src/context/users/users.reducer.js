import userTypes from './users.types';

export const USERS_INITIAL_STATE = {
    userProfile: {},
    userContact: {},
    userRoles: [],
    editorRoles: [],
    adminRoles: [],  
};

const usersReducer = (state, action) => {
    switch(action.type) {
        case userTypes.SET_USER:
            return {
                ...state,
                userProfile: action.payload.user,
                userContact: action.payload.contact
            };
        case userTypes.SET_USER_ROLES:
            return {
                ...state,
                userRoles: action.payload.userroles,
                editorRoles: action.payload.editorRoles,
                adminRoles: action.payload.adminRoles,
            }
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
        case userTypes.USER_LOGOUT:
            localStorage.clear()
            return {
                ...USERS_INITIAL_STATE
            }
        default:
            throw new Error(`unhandled type: ${action.type}`)
            // return state;
    }
};

export default usersReducer;