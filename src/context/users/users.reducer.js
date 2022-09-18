import userTypes from './users.types';

export const USERS_INITIAL_STATE = {
    userProfile: {},
    userRoles: [],
    userEvents: [],
};

const usersReducer = (state, action) => {
    switch(action.type) {
        case userTypes.SET_USER:
            return {
                ...state,
                userProfile: action.payload.user,
                userRoles: action.payload.roles,
                userEvents: action.payload.user_events,
            };
        case userTypes.SET_USER_ROLES:
            return {
                ...state,
                userRoles: action.payload,
            }
        case userTypes.ADD_USER_ROLE:
            return {
                ...state,
                userRoles: [ ...state.userRoles, action.payload ]
            }
        case userTypes.REMOVE_USER_ROLE:
            return {
                ...state,
                userRoles: state.userRoles.filter(role => role.business_id !== action.payload)
            }
        case userTypes.UPDATE_USER:
            return {
                ...state,
                userProfile: action.payload
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