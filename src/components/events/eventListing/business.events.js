import React from 'react';

import { useBusinessEventsQuery } from '../../../hooks/useEvents';
import LoadingSpinner from '../../loadingSpinner';
import EventListPreview from '../cardViews/eventListPreview';

const BusinessEvents = ({ business_id }) => {
    const { data: businessEventList, isLoading, isSuccess } = useBusinessEventsQuery(business_id)
    let active_events = []

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isSuccess) {
        active_events = businessEventList.data
    }

    return (
        <div>
            {
                (active_events.length > 0) &&
                    <h6 className='pt-3'>Upcoming Events</h6>
            }
            {
                (active_events.length > 0) &&
                    active_events.map(event => {
                        return (
                            <EventListPreview key={event.event_id} event={event} />
                        )
                    })
            }
        </div>
    )
}

export default BusinessEvents;