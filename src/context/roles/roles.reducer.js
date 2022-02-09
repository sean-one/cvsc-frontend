import roleTypes from './roles.types';

export const ROLES_INITIAL_STATE = {
    userRoles: [],
    creatorRoles: [],
    adminRoles: [],
    businessRoles: []
};

const rolesReducer = (state, action) => {
    switch(action.type) {
        case roleTypes.SET_ROLES:
            return {
                ...state,
                userRoles: action.payload
            }
        
        case roleTypes.SET_BUSINESS_ROLES:
            return {
                ...state,
                businessRoles: action.payload
            }
        
        case roleTypes.ROLES_RESET:
            return {
                ...ROLES_INITIAL_STATE
            }
        
        default:
            throw new Error(`unhandled type: ${action.type}`)
    }
};

export default rolesReducer;