import eventTypes from './events.types';

export const EVENTS_INITIAL_STATE = {
    events: []
};

const eventsReducer = (state, action) => {
    switch(action.type) {
        case eventTypes.GET_SUCCESS:
            return {
                ...state,
                events: action.payload
            }
        default:
            return state;
    }
};

export default eventsReducer;