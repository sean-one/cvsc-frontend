import React from 'react'
import styled from 'styled-components';

import { useEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import ServerDown from '../serverDown';
import EventCard from '../events/views/event.card';

import { ReactComponent as CVSCLogo } from '../../assets/cvsc_sqr.svg';

const CalendarStyles = styled.div`
    .calendarWrapper {
        width: 100%;
        padding: 0 0.375rem;
        max-width: var(--max-page-width);
        display: flex;
        flex-direction: column;
    }

    .calendarNoEvents {
        margin-top: 2.25rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.75rem;
    }

    .noEventsLogo {
        svg {
            width: 100%;
            height: auto;
            fill: var(--black-and-white);
        }
        
    }

    .calendarNoEventsHeader {
        font-weight: bold;
        letter-spacing: 0.075rem;
    }

    .calendarNoEventsLogin {
        margin-top: 1.5rem;
    }
`

const Calendar = () => {
    const { data: events_list, status: events_list_status, error: events_list_error } = useEventsQuery()

    if (events_list_status === 'pending') {
        return <LoadingSpinner />
    }

    if (events_list_error?.response?.status === 500) {
        return <ServerDown />
    }
    
    
    return (
        <CalendarStyles>

            <div className='calendarWrapper'>
                {events_list?.data?.length > 0 ? (
                    events_list?.data.map(event => <EventCard key={event.event_id} event={event} />)
                ) : (
                    <div className='calendarNoEvents'>
                        <CVSCLogo className='noEventsLogo' />
                        {/* <div className='calendarNoEventsHeader'>No events to show</div> */}
                        <div className='calendarNoEventsLogin'>Login and create a new event.</div>
                    </div>
                )}
            </div>


        </CalendarStyles>
    )
}

export default Calendar;