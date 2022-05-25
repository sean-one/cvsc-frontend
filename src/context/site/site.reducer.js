import siteTypes from './site.types';

export const SITE_INITIAL_STATE = {
    events: [],
    businessList: [],
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
        case siteTypes.CREATE_EVENT:
            return {
                ...state,
                events: [ ...state.events, action.payload ]
            }
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
        case siteTypes.ADD_BUSINESS:
            return {
                ...state,
                businessList: [ ...state.businessList, action.payload ]
            }
        case siteTypes.UPDATE_BUSINESS:
            return {
                ...state,
                businessList: state.businessList.map(business => (business.id === action.payload.id ? action.payload.business : business))
            }
        default:
            return state;
    }
}

export default siteReducer;