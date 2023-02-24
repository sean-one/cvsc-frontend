import React from 'react'
import { format } from 'date-fns';
import styled from 'styled-components';

import filterEventsByDay from '../../helpers/filterEventsByDay';
import { useEventsQuery } from '../../hooks/useEventsApi';

import LoadingSpinner from '../loadingSpinner';
import Day from './day.jsx';

const Styles = styled.div`
    .calendarContainer {
        margin: auto;
        max-width: 500px;
    }   
`

const Calendar = () => {
    const { data: eventList, isLoading, isError, isSuccess } = useEventsQuery()
    let siteSortedEvents = {}
    
    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isError) {
        return <div>Error...something is wrong</div>
    }

    if(isSuccess) {
        siteSortedEvents = filterEventsByDay(eventList.data)
    }


    return (
        <Styles>

            <div className='calendarContainer'>
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
            </div>

        </Styles>
    )
}

export default Calendar;