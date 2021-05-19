import React, { useContext } from 'react'
import { format, isPast } from 'date-fns';

import Day from './day.jsx';

import './calendar.css';
import CalendarContext from '../../context/calendarContext';

const Calendar = () => {
    const { dailyEventList } = useContext(CalendarContext);
    
    return (
        <div>
            <div className='calendar'>
                {
                    Object.keys(dailyEventList).sort(
                        // sort event list by date
                        (a,b) => new Date(a) - new Date(b)
                    ).map(key => {
                        const eventDate = new Date(key)
                        // exclude any events that have already passed
                        if (!isPast(eventDate)) {
                            return (
                                <Day key={format(eventDate, 't')} date={eventDate} schedule={dailyEventList[key]} />
                            )
                        }
                    })
                }
            </div>
        </div>

    )
}

export default Calendar;