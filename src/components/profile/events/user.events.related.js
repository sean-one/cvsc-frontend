import React from 'react';

import useAuth from '../../../hooks/useAuth';
import { useUserEventsQuery } from '../../../hooks/useEventsApi';
import EventSmallPreview from '../../events/views/event.small.preview';
import LoadingSpinner from '../../loadingSpinner';
import ServerReturnError from '../../serverReturnError';


const UserEventsRelated = () => {
    const { auth } = useAuth()
    const { data: user_events_list, status, error } = useUserEventsQuery(auth?.user?.id)
    let user_events = {}
    
    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        console.log(error)
        return <ServerReturnError />
    }

    user_events = user_events_list.data

    return (
        <div>
            {
                (user_events.length > 0)
                    ? user_events.map(event => {
                        return (
                            <EventSmallPreview key={event.event_id} event={event} />
                        )
                    })
                    : null
            }
        </div>
    )
}

export default UserEventsRelated;