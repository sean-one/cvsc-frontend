import siteTypes from './site.types';

export const SITE_INITIAL_STATE = {
    events: [],
    businessList: [],
    userProfile: {},
    userRoles: [],
    userContact: {},
    pendingRequestList: [],
    businessRoles: [],
};

const siteReducer = (state, action) => {
    switch(action.type) {
        case siteTypes.SET_EVENTS_AND_BUSINESS:
            return {
                ...state,
                events: action.payload.eventResponse,
                businessList: action.payload.businessResponse
            };
        case siteTypes.USER_SIGNIN:
            return {
                ...state,
                userProfile: action.payload.user,
                userContact: action.payload.contact
            };
        case siteTypes.SET_USER_ROLES:
            return {
                ...state,
                userRoles: action.payload
            };
        case siteTypes.REMOVE_EVENT:
            return {
                ...state,
                events: state.events.filter((event) => event.event_id !== action.payload)
            };
        case siteTypes.UPDATE_EVENT:
            return {
                ...state,
                events: state.events.map(event => (event.event_id === action.payload.id ? action.payload.event : event))
            }
        default:
            return state;
    }
}

export default siteReducer;