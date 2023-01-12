import React from 'react';

import { useUserEventsQuery } from '../../hooks/useEventsApi';
import useAuth from '../../hooks/useAuth';

import LoadingSpinner from '../loadingSpinner';
import EventPreview from './views/event.preview';
import InactiveListPreview from './views/inactive.preview';

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
            {
                (active_events.length > 0) &&
                    active_events.map(event => {
                        return (
                            <EventPreview key={event.event_id} event={event} />
                        )
                    })
            }
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