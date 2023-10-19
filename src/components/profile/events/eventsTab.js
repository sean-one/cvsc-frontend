import React from 'react';
import styled from 'styled-components'

import useAuth from '../../../hooks/useAuth';
import { useInactiveUserEvents } from '../../../hooks/useEventsApi';
import LoadingSpinner from '../../loadingSpinner';
import ServerReturnError from '../../serverReturnError';
import UserEventsRelated from '../../events/user.events.related';
import EventSmallPreview from '../../events/views/event.small.preview';

const EventsTabStyles = styled.div`
    .inactiveList {
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--error-color);
    }
`;

const EventsTab = () => {
    const { auth } = useAuth()
    const { data: inactive_events_list, status } = useInactiveUserEvents(auth?.user?.id)
    let inactive_events = {}

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        return <ServerReturnError />
    }

    inactive_events = inactive_events_list.data

    console.log('inactive events:')
    console.log(inactive_events)

    return (
        <EventsTabStyles>
            <div>
                <div>
                    {
                        (inactive_events.length > 0)
                            ? <div className='inactiveList'>
                                <div>inactive events...</div>
                                {inactive_events.map(event => {
                                    return (
                                        <EventSmallPreview key={event.event_id} event={event} />
                                    )
                                })}
                            </div>
                            : null
                    }
                </div>
                <UserEventsRelated />
            </div>
        </EventsTabStyles>
    )
}

export default EventsTab;