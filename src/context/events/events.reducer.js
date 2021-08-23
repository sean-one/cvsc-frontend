import eventTypes from './events.types';

export const EVENTS_INITIAL_STATE = {
    events: [],
    businessList: []
};

const eventsReducer = (state, action) => {
    switch(action.type) {
        case eventTypes.GET_SUCCESS:
            return {
                ...state,
                events: action.payload.events,
                businessList: action.payload.businesses
            }
        case eventTypes.ADD_EVENT_TO_LIST:
            return {
                ...state,
                events: [...state.events, action.payload]
            }
        case eventTypes.REMOVE_EVENT:
            return {
                ...state,
                events: state.events.filter((event) => event.event_id !== action.payload)
            }
        default:
            return state;
    }
};

export default eventsReducer;