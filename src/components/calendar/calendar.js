import React, { useContext } from 'react'
import { format, isPast } from 'date-fns';

import Day from './day.jsx';

import './calendar.css';
import { sortDaysEvents } from './getCalendar';
import CalendarContext from '../../context/calendarContext';

const Calendar = () => {
    const { dailyEventList } = useContext(CalendarContext);
    const sortedEvents = sortDaysEvents(dailyEventList);

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
                        // exclude any events that have already passed
                        if (!isPast(eventDate)) {
                            return (
                                <Day key={format(eventDate, 't')} date={eventDate} schedule={sortedEvents[key]} />
                            )
                        }
                        return null;
                    })
                }
            </div>
        </div>

    )
}

export default Calendar;