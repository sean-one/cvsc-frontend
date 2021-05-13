import React, { useContext } from 'react'
import { format } from 'date-fns';

// import Day from './day.jsx';

import './calendar.css';
// import { adjustHeight } from './calendarStyleLogic'
// import { getDaysEvents } from './getCalendar';
import CalendarContext from '../../context/calendarContext';

const Calendar = () => {
    const { selectedDay, dailyEventList } = useContext(CalendarContext);
    // const { selectedDay, calendarDates, dailyEventList } = useContext(CalendarContext);
    // const weekCount = calendarDates.length
    
    console.log(dailyEventList)

    return (
        <div>
            <div className='calendar'>
                <h1>{format(selectedDay, 'MMMM yyyy')}</h1>
                {
                    Object.keys(dailyEventList).map((key) => {
                        const eventDate = new Date(key)
                        console.log(eventDate)
                        return (
                            <div>
                                <h1>{key}</h1>
                                {dailyEventList[key].map((dataItem) => {
                                        return (
                                            <p>{dataItem.eventName}</p>
                                        )
                                })}
                            </div>
                        )
                    })
                }
                {/* {
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
                } */}
            </div>
        </div>

    )
}

export default Calendar;