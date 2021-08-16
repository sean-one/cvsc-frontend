import userTypes from './users.types';
import { createLocalUser } from './users.utils';

export const USERS_INITIAL_STATE = {
    userProfile: {},
    userEvents: []
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
        case userTypes.GET_USER_EVENTS:
            return {
                ...state,
                userEvents: action.payload
            };
        case userTypes.DELETE_EVENT:
            return {
                ...state,
                userEvents: state.userEvents.filter((event) => event.event_id !== action.payload)
                // userEvents: removeFromArray(action.payload, state.userEvents)
            };
        default:
            throw new Error(`unhandled type: ${action.type}`)
            // return state;
    }
};

export default usersReducer;