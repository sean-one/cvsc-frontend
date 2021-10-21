import React, { useReducer, createContext } from 'react';
import eventsReducer, { EVENTS_INITIAL_STATE } from './events.reducer';
import eventsTypes from './events.types';
import { format, startOfDay } from 'date-fns';
import eventTypes from './events.types';

export const EventsContext = createContext({
    ...EVENTS_INITIAL_STATE
});

const EventsProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(eventsReducer, EVENTS_INITIAL_STATE)
    const { events, businessList, userEvents } = store;

    const setCalendar = (eventResponse, businessResponse) => {
        dispatch({
            type: eventsTypes.SET_SITE_DATA,
            payload: { eventResponse, businessResponse }
        })
    }
    
    const setEvents = (events) => {
        dispatch({
            type: eventsTypes.GET_EVENTS_OK,
            payload: events
        })
    }

    const setUserEventList = (events) => {
        dispatch({
            type: eventTypes.GET_USER_EVENTS_OK,
            payload: events
        })
    }

    // filters the business list removing business not open to request & businesses user already has roles for
    const useFilterBusinessRequestList = (userroles) => {
        return businessList.filter(business => business.requestOpen === true && !userroles.includes(business.id))
    }

    // get the events for each specific day sorted into a list of days contianing a list of events
    const useSortedEvents = () => {
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

    // filters business list to only include businesses with the type of brand
    const useBrandList = () => {
        return businessList.filter(business => business.businesstype === "brand" || business.businesstype === "both")
    }
    
    // filters business list to only include businesses with the type of venue
    const useVenueList = () => {
        return businessList.filter(business => business.businesstype === "venue" || business.businesstype === "both")
    }

    const getUpcomingEvents = (listOfEvents, venueId, brandId, currentId) => {
        let results = {}
        if (venueId === brandId) {
            let upcomingEvents = listOfEvents.filter(event => ((event.venue_id === brandId || event.brand_id === brandId) && event.event_id !== currentId))
            results = {...results, upcomingEvents }
        } else {
            let upcomingAtLocation = listOfEvents.filter(event => (event.venue_id === venueId && event.event_id !== currentId))
            let upcomingWithBrand = listOfEvents.filter(event => (event.brand_id === brandId && event.event_id !== currentId))
            results = {...results, upcomingAtLocation, upcomingWithBrand }
        }
        return results;
    }

    function addToEvents(newevent) {
        dispatch({
            type: eventsTypes.ADD_EVENT_TO_LIST,
            payload: newevent
        })
    }

    const removeEvent = (eventId) => {
        dispatch({
            type: eventsTypes.REMOVE_EVENT,
            payload: eventId
        })
    }

    return (
        <EventsContext.Provider value={
            {
                setCalendar,
                events,
                setEvents,
                setUserEventList,
                useFilterBusinessRequestList,
                userEvents,
                useSortedEvents,
                useBrandList,
                useVenueList,
                getUpcomingEvents,
                addToEvents,
                removeEvent
            }
        }>
            {children}
        </EventsContext.Provider>
    )
}

export default EventsProvider;