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
    const { data: eventList, status: events_status } = useEventsQuery()

    if (events_status === 'loading') {
        return <LoadingSpinner />
    }

    if (events_status === 'error') {
        return <ServerDown />
    }


    return (
        <CalendarStyles>

            <div className='calendarWrapper'>
                {eventList.data.length > 0 ? (
                    eventList?.data.map(event => <EventCard key={event.event_id} event={event} />)
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