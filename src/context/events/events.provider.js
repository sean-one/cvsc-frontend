import React, { useReducer, createContext, useEffect } from 'react';
import AxiosInstance from '../../helpers/axios';
import eventsReducer, { EVENTS_INITIAL_STATE } from './events.reducer';
import eventsTypes from './events.types';
import { format, startOfDay } from 'date-fns';

export const EventsContext = createContext({
    ...EVENTS_INITIAL_STATE
});

const EventsProvider = ({ children }) => {
    const [ store, dispatch ] = useReducer(eventsReducer, EVENTS_INITIAL_STATE)
    const { events } = store;
    
    // get the events for each specific day sorted into a list of days contianing a list of events
    const sortByDay = (listofevents) => {
        return listofevents.reduce((obj, event) => {
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

    const removeFromEvents = (eventId) => {
        dispatch({
            type: eventsTypes.REMOVE_EVENT,
            payload: eventId
        })
    }

    
    useEffect(() => {
        AxiosInstance.get('/events')
            .then(events => {
                dispatch({
                    type: eventsTypes.GET_SUCCESS,
                    payload: events.data
                })
            })
            .catch(err => console.log(err))

    }, [])

    return (
        <EventsContext.Provider value={{ events, sortByDay, getUpcomingEvents, removeFromEvents }}>
            {children}
        </EventsContext.Provider>
    )
}

export default EventsProvider;