import React, { useContext } from 'react'
import { format } from 'date-fns';

import Day from './day.jsx';

import './calendar.css';
import { adjustHeight } from './calendarStyleLogic'
import { getDaysEvents } from './getCalendar';
import CalendarContext from '../../context/calendarContext';

const Calendar = () => {
    const { selectedDay, calendarDates } = useContext(CalendarContext);
    const weekCount = calendarDates.length


    return (
        <div>
            <div className='calendar'>
                <h1>{format(selectedDay, 'MMMM yyyy')}</h1>
                {
                    calendarDates.map((week, i) => (
                        <div className='weeks' key={i}>
                            {
                                week.map((day, i) => (
                                    <div className={`daywrapper ${adjustHeight(weekCount)}`} key={i}>
                                        <Day day={day} schedule={getDaysEvents(day) }/>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>

    )
}

export default Calendar;