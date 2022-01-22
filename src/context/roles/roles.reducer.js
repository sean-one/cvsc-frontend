import roleTypes from './roles.types';

export const ROLES_INITIAL_STATE = {
    userRoles: [],
    editorRoles: [],
    adminRoles: [],
}

const rolesReducer = (state, action) => {
    switch(action.type) {
        case roleTypes.SET_USER_ROLES:
            return {
                ...state,
                userRoles: action.payload.userroles,
                editorRoles: action.payload.editorRoles,
                adminRoles: action.payload.adminRoles,
            }
        case roleTypes.ROLE_RESET:
            return {
                ...ROLES_INITIAL_STATE
            }
        default:
            throw new Error(`unhandled type: ${action.type}`)
    }
}

export default rolesReducer;