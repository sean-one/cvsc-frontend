import React, { useContext } from 'react'
import { format } from 'date-fns';

import Day from './day.jsx';

import './calendar.css';
import { EventsContext } from '../../context/events/events.provider.js';

const Calendar = () => {
    const { events, sortByDay } = useContext(EventsContext);
    const sortedEvents = sortByDay(events);

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
            </div>
        </div>

    )
}

export default Calendar;