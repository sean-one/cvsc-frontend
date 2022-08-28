import React from 'react';

import { useEventsQuery } from '../../../hooks/useEvents';
import EventList from '../eventList';


const UpcomingBusiness = ({ business_name, business_id }) => {
    const { data: events, isLoading } = useEventsQuery()

    if (isLoading) {
        return <div>loading..</div>
    }

    const business_events = events.data.filter(event => event.brand_id === business_id || event.venue_id === business_id)

    return (
        <div>
            {
                (business_events.length > 0) &&
                    <h6>{`Upcoming ${business_name} events`}</h6>
            }
            {
                (business_events.length > 0) && (
                    <EventList event_list={business_events} />
                )
            }
        </div>
    )
}

export default UpcomingBusiness;