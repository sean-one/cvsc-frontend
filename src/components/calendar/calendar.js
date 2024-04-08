import React from 'react'
import styled from 'styled-components';

import { useEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import ServerDown from '../serverDown';
import EmptyListReturn from '../emptylist.return';
import EventCard from '../events/views/event.card';


const CalendarStyles = styled.div`
    .calendarWrapper {
        width: 100%;
        max-width: var(--max-page-width);
        display: flex;
        flex-direction: column;
    }
`

const Calendar = () => {
    const { data: events_list, isPending, isError } = useEventsQuery()
    

    return (
        <CalendarStyles>
            <div className='calendarWrapper'>
                {
                    isPending ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        <ServerDown />
                    ) : (events_list?.data?.length !== 0) ? (
                        events_list?.data.map(event => {
                            return (
                                <EventCard key={event.event_id} event={event} />
                            )
                        })
                    ) : (
                        <EmptyListReturn listtype='event'/>
                    )
                }
            </div>
        </CalendarStyles>
    )
}

export default Calendar;