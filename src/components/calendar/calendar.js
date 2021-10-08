import React, { useContext, useEffect } from 'react'
import { format } from 'date-fns';
import AxiosInstance from '../../helpers/axios';
// import EventPreview from '../events/eventPreview';

import Day from './day.jsx';

import './calendar.css';
import { EventsContext } from '../../context/events/events.provider.js';

const Calendar = () => {
    const { setEvents, useSortedEvents } = useContext(EventsContext);
    const sortedEvents = useSortedEvents();

    useEffect(() => {
        AxiosInstance.get('/events')
            .then(events => {
                setEvents(events.data)
                // console.log(events.data)
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div>
            <div className='calendar'>
                <p>filter</p>
                {
                    Object.keys(sortedEvents).sort(
                        // sort event list by date
                        (a,b) => new Date(a) - new Date(b)
                    ).map(key => {
                        const eventDate = new Date(key)
                        return (
                            <Day key={format(eventDate, 't')} date={eventDate} schedule={sortedEvents[key]} />
                        )
                    })
                }
                {/* {
                    events.map(event => {
                        return (
                            <EventPreview key={event.event_id} event={event} />
                        )
                    })
                } */}
            </div>
        </div>

    )
}

export default Calendar;