import React from 'react';

import { useUserEventsQuery } from '../../../hooks/useEventsApi';
import useAuth from '../../../hooks/useAuth';

import LoadingSpinner from '../../loadingSpinner';
import EventPreview from '../../events/views/event.preview';
import InactiveListPreview from '../../events/views/inactive.preview';

const UserEvents = () => {
    const { auth } = useAuth()
    
    const { data: usersEvents, isLoading, isSuccess } = useUserEventsQuery(auth.user.id)
    let active_events = []
    let inactive_events = []

    if(isLoading) {
        <LoadingSpinner />
    }

    if(isSuccess) {
        active_events = usersEvents.data.filter(event => event.active_event)
        inactive_events = usersEvents.data.filter(event => !event.active_event)
    }

    return (
        <div>
            <h6>Created Events</h6>
            {
                (active_events.length > 0) &&
                    active_events.map(event => {
                        return (
                            <EventPreview key={event.event_id} event={event} />
                        )
                    })
            }
            <div className='border border-bottom my-2'></div>
            <h6>Inactive Events</h6>
            {
                (inactive_events.length > 0) &&
                    inactive_events.map(event => {
                        return (
                            <InactiveListPreview key={event.event_id} event={event} />
                        )
                    })
            }
        </div>
    )
}

export default UserEvents;