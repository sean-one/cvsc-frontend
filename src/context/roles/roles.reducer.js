import roleTypes from './roles.types';

export const ROLES_INITIAL_STATE = {
    userRoles: [],
    editorRoles: [],
    adminRoles: [],
    isAdmin: false,
    isEditor: false
}

const rolesReducer = (state, action) => {
    switch(action.type) {
        case roleTypes.SET_USER_ROLES:
            return {
                ...state,
                userRoles: action.payload,
                editorRoles: state.userRoles.filter(role => role.roletype === 'creator'),
                adminRoles: state.userRoles.filter(role => role.roletype === 'admin'),
                isAdmin: (state.adminRoles.length >= 1) ? true : false,
                isEditor: (state.editorRoles.length >= 1) ? true : false
            }
        default:
            throw new Error(`unhandled type: ${action.type}`)
    }
}

export default rolesReducer;