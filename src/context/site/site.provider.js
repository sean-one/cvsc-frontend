import React, { createContext, useReducer } from 'react';
import siteReducer, { SITE_INITIAL_STATE } from './site.reducer';
import siteTypes from './site.types';

export const SiteContext = createContext({
    ...SITE_INITIAL_STATE
});

const SiteProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(siteReducer, SITE_INITIAL_STATE)
    const { userProfile, events, businessList } = store;

    // used inside calendar component build site event and businesses
    const setSiteInfo = ( eventResponse, businessResponse ) => {
        dispatch({
            type: siteTypes.SET_EVENTS_AND_BUSINESS,
            payload: { eventResponse, businessResponse }
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

    // USER PROFILE
    const userEvents = () => {
        const userId = userProfile.id
        return events.filter(event => event.created_by === Number(userId))
    }

    const useVenueList = () => {
        return businessList.filter(business => (business.businesstype === 'venue' || business.businesstype === 'both') && business.activeBusiness === true)
    }

    const useBrandList = () => {
        return businessList.filter(business => (business.businesstype === 'brand' || business.businesstype === 'both') && business.activeBusiness === true)
    }

    return (
        <SiteContext.Provider value={
            {
                events,
                businessList,
                setSiteInfo,
                removeEvent,
                updateEvent,
                userEvents,
                // USER
                userProfile,
                // BUSINESS
                useVenueList,
                useBrandList
            }
        }>
            {children}
        </SiteContext.Provider>
    )
}

export default SiteProvider;