import React from 'react'
import { format } from 'date-fns';
import styled from 'styled-components';

import { useEventsQuery } from '../../hooks/useEventsApi';

import LoadingSpinner from '../loadingSpinner';
import EventPreview from '../events/views/event.preview';

const CalendarStyles = styled.div`
    .calendarWrapper {
        width: 100%;
        max-width: var(--max-page-width);
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid yellow;
    }
`

const Calendar = () => {
    const { data: eventList, isLoading, isError, isSuccess } = useEventsQuery()
    let sortedEvents = []

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isError) {
        return <div>Error...something is wrong</div>
    }

    if(isSuccess) {
        sortedEvents = eventList.data.sort((a,b) => {
            if (format(new Date(a.eventdate), 't') > format(new Date(b.eventdate), 't')) {
                return 1;
            } else if (format(new Date(a.eventdate), 't') < format(new Date(b.eventdate), 't')) {
                return -1;
            } else {
                if (a.eventstart > b.eventstart) {
                    return 1
                } else {
                    return -1
                }
            }
        })
    }
    

    return (
        <CalendarStyles>

            <div className='calendarWrapper'>
                {
                    sortedEvents.map(event => {
                        return (
                            <EventPreview key={event.event_id} event={event} />
                        )
                    })
                }
            </div>

        </CalendarStyles>
    )
}

export default Calendar;