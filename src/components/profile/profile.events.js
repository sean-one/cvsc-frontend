import React from 'react';

import useAuth from '../../hooks/useAuth';
import { useUserEventsQuery } from '../../hooks/useEventsApi';

import LoadingSpinner from '../loadingSpinner';
import EventPreview from '../events/views/event.preview';


const ProfileEvents = () => {
    const { auth } = useAuth()

    const { data: profileEvents, isLoading, isSuccess } = useUserEventsQuery(auth.user.id)
    let events_list = []

    if(isLoading) { return <LoadingSpinner /> }

    if(isSuccess) { events_list = profileEvents.data}

    return (
        <div>
            {
                (events_list.length > 0)
                    ? events_list.map(event => {
                        return (
                            <EventPreview key={event.event_id} event={event} />
                        )
                    })
                    : null
            }
        </div>
    )
}

export default ProfileEvents;