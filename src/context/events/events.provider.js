import React, { useState, useReducer, createContext, useEffect } from 'react';
import AxiosInstance from '../../helpers/axios';
import eventsReducer, { EVENTS_INITIAL_STATE } from './events.reducer';
import eventsTypes from './events.types';
import { format, startOfDay } from 'date-fns';
import axios from 'axios';

export const EventsContext = createContext({
    ...EVENTS_INITIAL_STATE
});

const EventsProvider = ({ children }) => {
    const [ refresher, setRefresher ] = useState(true)
    const [ store, dispatch ] = useReducer(eventsReducer, EVENTS_INITIAL_STATE)
    const { events, businessList } = store;
    
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

    const useBrandList = () => {
        return businessList.filter(business => business.businesstype === "brand" || business.businesstype === "both")
    }

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
        console.log('inside addToEvents')
        dispatch({
            type: eventsTypes.ADD_EVENT_TO_LIST,
            payload: newevent
        })
    }

    const removeFromEvents = (eventId) => {
        dispatch({
            type: eventsTypes.REMOVE_EVENT,
            payload: eventId
        })
        setRefresher(!refresher)
    }
    
    useEffect(() => {
        const eventsCall = AxiosInstance.get('/events')
        const businessCall = AxiosInstance.get('/business')
        axios.all([eventsCall, businessCall])
            .then(axios.spread((...responses) => {
                const events = responses[0].data
                const businesses = responses[1].data
                dispatch({ type: eventsTypes.GET_SUCCESS, payload: { events, businesses } })
            }))
            .catch(err => console.log(err))
    }, [refresher])

    return (
        <EventsContext.Provider value={
            {
                events,
                useSortedEvents,
                useBrandList,
                useVenueList,
                getUpcomingEvents,
                addToEvents,
                removeFromEvents
            }
        }>
            {children}
        </EventsContext.Provider>
    )
}

export default EventsProvider;