import React from 'react';

import { useUserEventsQuery } from '../../../hooks/useEvents';

import LoadingSpinner from '../../loadingSpinner';
import EventListPreview from '../cardViews/eventListPreview';

const UserEvents = ({ user_id }) => {
    const { data: usersEvents, isLoading, isSuccess } = useUserEventsQuery(user_id)
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
                            <EventListPreview key={event.event_id} event={event} />
                        )
                    })
            }
            {
                (inactive_events.length > 0) &&
                    inactive_events.map(event => {
                        return (
                            <EventListPreview key={event.event_id} event={event} inactive />
                        )
                    })
            }
        </div>
    )
}

export default UserEvents;