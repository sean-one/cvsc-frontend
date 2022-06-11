import siteTypes from './site.types';

export const SITE_INITIAL_STATE = {
    events: [],
    businessList: [],
    businessUserRoles: [],
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
        case siteTypes.REMOVE_BUSINESS:
            return {
                ...state,
                businessList: state.businessList.filter(business => business.id !== action.payload),
                businessUserRoles: []
            }
        case siteTypes.SET_BUSINESS_USER_ROLES:
            return {
                ...state,
                businessUserRoles: action.payload
            }
        case siteTypes.UPDATE_BUSINESS_USER_ROLES:
            return {
                ...state,
                businessUserRoles: state.businessUserRoles.map(role => (role.id === action.payload.role_id ? action.payload.updated_role : role))
            }
        case siteTypes.REMOVE_BUSINESS_USER_ROLE:
            return {
                ...state,
                businessUserRoles: state.businessUserRoles.filter((role) => role.id !== action.payload)
            }
        default:
            return state;
    }
}

export default siteReducer;