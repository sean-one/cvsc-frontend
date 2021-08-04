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

    
    useEffect(() => {
        AxiosInstance.get('/events')
            .then(events => {
                console.log('called event get')
                dispatch({
                    type: eventsTypes.GET_SUCCESS,
                    payload: events.data
                })
            })
            .catch(err => console.log(err))

    }, [])

    return (
        <EventsContext.Provider value={{ events, sortByDay }}>
            {children}
        </EventsContext.Provider>
    )
}

export default EventsProvider;