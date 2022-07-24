import React from 'react'
import { format } from 'date-fns';

import filterEventsByDay from '../../helpers/filterEventsByDay';
import { useEventsQuery } from '../../hooks/useEvents';

import Day from './day.jsx';

const Calendar = () => {
    const { data, isLoading, isError, isSuccess } = useEventsQuery()
    let siteSortedEvents = {}
    
    if(isLoading) {
        return <div>loading...</div>
    }

    if(isError) {
        return <div>Error...something is wrong</div>
    }

    if(isSuccess) {
        siteSortedEvents = filterEventsByDay(data.data)
    }

    return (
        <>
            {
                Object.keys(siteSortedEvents).sort(
                    // sort event list by date
                    (a,b) => new Date(a) - new Date(b)
                ).map(key => {
                    const eventDate = new Date(key)
                    return (
                        <Day key={format(eventDate, 't')} date={eventDate} schedule={siteSortedEvents[key]} />
                    )
                })
            }
        </>
    )
}

export default Calendar;