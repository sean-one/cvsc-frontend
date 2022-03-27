import React, { createContext, useReducer } from 'react';
import siteReducer, { SITE_INITIAL_STATE } from './site.reducer';
import siteTypes from './site.types';

export const SiteContext = createContext({
    ...SITE_INITIAL_STATE
});

const SiteProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(siteReducer, SITE_INITIAL_STATE)
    const { events, businessList } = store;

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
    const useBusinessById = (business_id) => {
        return businessList.find(business => business.id === business_id)
    }

    const useBusinessAdmin = (user_id) => {
        return businessList.filter(business => business.business_admin === user_id)
    }

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
                useBusinessById,
                useBusinessAdmin
            }
        }>
            {children}
        </SiteContext.Provider>
    )
}

export default SiteProvider;