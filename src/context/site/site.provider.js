import React, { createContext, useReducer } from 'react';
import siteReducer, { SITE_INITIAL_STATE } from './site.reducer';
import siteTypes from './site.types';

export const SiteContext = createContext({
    ...SITE_INITIAL_STATE
});

const SiteProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(siteReducer, SITE_INITIAL_STATE)
    const { events, businessList, businessUserRoles } = store;

    // used inside calendar component build site event and businesses
    const setSiteInfo = ( eventResponse, businessResponse ) => {
        dispatch({
            type: siteTypes.SET_EVENTS_AND_BUSINESS,
            payload: { eventResponse, businessResponse }
        })
    }

    const useEventById = (event_id) => {
        return events.find(event => event.event_id === event_id)
    }

    const useEventsByUser = (user_id) => {
        return events.filter(event => event.created_by === user_id)
    }

    const useUpcomingVenue = (business_id, event_id) => {
        return events.filter(e => e.venue_id === business_id && e.event_id !== event_id)
    }
    
    const useUpcomingBrand = (business_id, event_id) => {
        return events.filter(e => e.brand_id === business_id && e.event_id !== event_id)
    }

    // returns an array of events with the business listed as the brand and or the venue
    const useEventsByBusiness = (business_id) => {
        return events.filter(event => event.brand_id === business_id || event.venue_id === business_id)
    }

    const useEventsByRoles = (account_type, business_id) => {
        let event_list = []
        let creator_ids = []
        if(account_type === 'manager') {
            useCreators.map(role => {
                return creator_ids.push(role.user_id)
            })

            event_list = events.filter(event => creator_ids.includes(event.created_by))

        } else if(account_type === 'admin') {
            event_list = events.filter(event => event.brand_id === business_id || event.venue_id === business_id)
        }
        
        return event_list
    }

    const createEvent = (event) => {
        dispatch({
            type: siteTypes.CREATE_EVENT,
            payload: event
        })
    }

    const removeEvent = (id) => {
        dispatch({
            type: siteTypes.REMOVE_EVENT,
            payload: id
        })
    }

    const updateEvent = (id, event) => {
        dispatch({
            type: siteTypes.UPDATE_EVENT,
            payload: { id, event }
        })
    }


    // BUSINESS
    const addBusiness = (business) => {
        dispatch({
            type: siteTypes.ADD_BUSINESS,
            payload: business
        })
    }

    const updateBusiness = (id, business) => {
        dispatch({
            type: siteTypes.UPDATE_BUSINESS,
            payload: { id, business }
        })
    }

    const useBusinessById = (business_id) => {
        return businessList.find(business => business.id === business_id)
    }

    const useBusinessByIdList = (business_ids) => {
        let business_list = []
        if(businessList.length > 0) {
            business_list = businessList.filter(business => business_ids.includes(business.id))
        }
        return business_list
    }

    const useBusinessAdmin = (user_id) => {
        return businessList.filter(business => business.business_admin === user_id)
    }

    const useVenueList = () => {
        let venue_list = []
        if (businessList.length > 0) {
            venue_list = businessList.filter(business => business.business_type !== 'brand' && business.active_business === true)
        }
        return venue_list
    }

    const useBrandList = () => {
        let brand_list = []
        if (businessList.length > 0) {
            brand_list = businessList.filter(business => business.business_type !== 'venue' && business.active_business === true)
        }
        return brand_list
    }


    // BUSINESS USER ROLES
    const setBusinessUserRoles = (business_user_roles) => {
        dispatch({
            type: siteTypes.SET_BUSINESS_USER_ROLES,
            payload: business_user_roles
        })
    }

    const useBusinessRole = (user_id) => {
        return businessUserRoles.find(user_role => user_role.user_id === user_id)
    }

    const updateBusinessUserRoles = (role_id, updated_role) => {
        dispatch({
            type: siteTypes.UPDATE_BUSINESS_USER_ROLES,
            payload: { role_id, updated_role }
        })
    }

    const removeBusinessUserRole = (role_id) => {
        dispatch({
            type: siteTypes.REMOVE_BUSINESS_USER_ROLE,
            payload: role_id
        })
    }

    const usePending = businessUserRoles.filter(user_role => !user_role.active_role)

    const useCreators = businessUserRoles.filter(user_role => (user_role.role_type === 'creator' && user_role.active_role))
    
    const useManagers = businessUserRoles.filter(user_role => (user_role.role_type === 'manager' && user_role.active_role))

    return (
        <SiteContext.Provider value={
            {
                events,
                businessList,
                setSiteInfo,
                useEventById,
                useEventsByUser,
                useUpcomingVenue,
                useUpcomingBrand,
                useEventsByBusiness,
                useEventsByRoles,
                createEvent,
                removeEvent,
                updateEvent,
                
                // BUSINESS
                addBusiness,
                updateBusiness,
                useBusinessById,
                useBusinessByIdList,
                useBusinessAdmin,
                useVenueList,
                useBrandList,
                
                // BUSINESS USER ROLES
                setBusinessUserRoles,
                useBusinessRole,
                updateBusinessUserRoles,
                removeBusinessUserRole,
                usePending,
                useCreators,
                useManagers,
            }
        }>
            {children}
        </SiteContext.Provider>
    )
}

export default SiteProvider;