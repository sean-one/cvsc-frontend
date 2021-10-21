import eventTypes from './events.types';

export const EVENTS_INITIAL_STATE = {
    events: [],
    businessList: [],
    userEvents: []
};

const eventsReducer = (state, action) => {
    switch(action.type) {
        case eventTypes.SET_SITE_DATA:
            return {
                ...state,
                events: action.payload.eventResponse,
                businessList: action.payload.businessResponse
            }
        case eventTypes.GET_EVENTS_OK:
            return {
                ...state,
                events: action.payload
            }
        case eventTypes.GET_USER_EVENTS_OK:
            return {
                ...state,
                userEvents: action.payload
            }
        case eventTypes.ADD_EVENT_TO_LIST:
            return {
                ...state,
                events: [...state.events, action.payload]
            }
        case eventTypes.REMOVE_EVENT:
            return {
                ...state,
                events: state.events.filter((event) => event.event_id !== action.payload),
                userEvents: state.userEvents.filter((event) => event.event_id !== action.payload)
            }
        default:
            return state;
    }
};

export default eventsReducer;