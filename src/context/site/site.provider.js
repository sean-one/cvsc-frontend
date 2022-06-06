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

    const useBusinessName = (business_id) => {
        const selectedBusiness = businessList.find(business => business.id === business_id )
        return selectedBusiness.business_name
    }

    const useBusinessAdmin = (user_id) => {
        return businessList.filter(business => business.business_admin === user_id)
    }

    // BUSINESS USER ROLES
    const setBusinessUserRoles = (business_user_roles) => {
        dispatch({
            type: siteTypes.SET_BUSINESS_USER_ROLES,
            payload: business_user_roles
        })
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

    const useAdminRole = businessUserRoles.filter(user_role => (user_role.role_type === 'admin' && user_role.active_role))

    return (
        <SiteContext.Provider value={
            {
                events,
                businessList,
                setSiteInfo,
                useEventById,
                createEvent,
                removeEvent,
                updateEvent,
                // BUSINESS
                addBusiness,
                updateBusiness,
                useBusinessById,
                useBusinessName,
                useBusinessAdmin,
                // BUSINESS USER ROLES
                setBusinessUserRoles,
                updateBusinessUserRoles,
                removeBusinessUserRole,
                usePending,
                useCreators,
                useManagers,
                useAdminRole,
            }
        }>
            {children}
        </SiteContext.Provider>
    )
}

export default SiteProvider;