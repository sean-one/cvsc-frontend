import userTypes from './users.types';

export const USERS_INITIAL_STATE = {
    userProfile: {}
};

const usersReducer = (state, action) => {
    switch(action.type) {
        case userTypes.SIGNIN_SUCCESS:
            return {
                ...state,
                userProfile: action.payload
            }
        default:
            return state;
    }
};

export default usersReducer;