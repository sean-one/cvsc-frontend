import React from 'react'
import { format } from 'date-fns';
import styled from 'styled-components';

import { useEventsQuery } from '../../hooks/useEventsApi';

import LoadingSpinner from '../loadingSpinner';
import ServerDown from '../serverDown';
import EventCard from '../events/views/event.card';

const CalendarStyles = styled.div`
    .calendarWrapper {
        width: 100%;
        padding: 0 0.25rem;
        max-width: var(--max-page-width);
        display: flex;
        flex-direction: column;
    }

    .calendarNoEvents {
        margin-top:1.5rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
    }

    .calendarNoEventsHeader {
        font-weight: bold;
        letter-spacing: 0.05rem;
    }

    .calendarNoEventsLogin {
        margin-top: 1rem;
    }
`

const Calendar = () => {
    const { data: eventList, isLoading, isError, isSuccess } = useEventsQuery()
    let sortedEvents = []

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isError) {
        return <ServerDown />
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
                    (sortedEvents.length > 0)
                        ? <div>{
                            sortedEvents.map(event => {
                                return (
                                    <EventCard key={event.event_id} event={event} />
                                )
                            })
                        } </div>
                        : <div className='calendarNoEvents'>
                            <div className='calendarNoEventsHeader'>No events to show</div>
                            <div className='calendarNoEventsLogin'>Login and create a new event.</div>
                        </div>

                }
            </div>

        </CalendarStyles>
    )
}

export default Calendar;