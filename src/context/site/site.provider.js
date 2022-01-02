import React, { createContext, useReducer } from 'react';
import siteReducer, { SITE_INITIAL_STATE } from './site.reducer';
import siteTypes from './site.types';
import { userSignIn } from './site.utils';
import { format, startOfDay } from 'date-fns';

export const SiteContext = createContext({
    ...SITE_INITIAL_STATE
});

const SiteProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(siteReducer, SITE_INITIAL_STATE)
    const { userRoles, userProfile, events, businessList } = store;

    const setSiteInfo = ( eventResponse, businessResponse ) => {
        dispatch({
            type: siteTypes.SET_EVENTS_AND_BUSINESS,
            payload: { eventResponse, businessResponse }
        })
    }

    // get the events for each specific day sorted into a list of days containing a list of events
    const useEventsSortedByDay = () => {
        return events.reduce((obj, event) => {
            let eventDate = new Date(event.eventdate);
            // get the day of the event
            eventDate = format(startOfDay(eventDate), 'PP');

            // check to see if that day has any other events
            if (!obj.hasOwnProperty(eventDate)) {
                // create days event
                obj[eventDate] = []
            }

            // add the event to that specific day
            obj[eventDate].push(event);

            return obj;
        }, {});
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
    const setProfile = userdata => {
        // add info to local storage
        userSignIn(userdata)

        dispatch({
            type: siteTypes.USER_SIGNIN,
            payload: { user: userdata.user, contact: userdata.contact }
        })
    }

    const setRoles = roles => {
        dispatch({
            type: siteTypes.SET_USER_ROLES,
            payload: roles
        })
    }

    const userEvents = () => {
        const userId = userProfile.id
        return events.filter(event => event.created_by === Number(userId))
    }

    const useAdminRoles = () => {
        const userAdmin = userRoles.filter(role => role.roletype === 'admin')
        let adminArr = []
        userAdmin.map(row => {
            return adminArr.push(row.business.id)
        })

        return adminArr;
    }

    const isAdmin = () => {
        const adminIndex = userRoles.findIndex(role => role.roletype === 'admin')
        if (adminIndex === -1) {
            return false;
        } else {
            return true;
        }
    }

    const isEditor = () => {
        if (userRoles.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // BUSINESS
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
                useEventsSortedByDay,
                removeEvent,
                updateEvent,
                userEvents,
                // USER
                userProfile,
                setProfile,
                // userRoles,
                setRoles,
                isAdmin,
                isEditor,
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