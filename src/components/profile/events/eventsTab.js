import React from 'react';

import useAuth from '../../../hooks/useAuth';
import { useInactiveUserEvents } from '../../../hooks/useEventsApi';
import LoadingSpinner from '../../loadingSpinner';
import ServerReturnError from '../../serverReturnError';
import UserEventsRelated from '../../events/user.events.related';


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
        <div>
            <div>inactive event list....</div>
            <UserEventsRelated />
        </div>
    )
}

export default EventsTab;