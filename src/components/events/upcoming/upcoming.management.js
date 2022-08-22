import React from 'react';

import { useEventsQuery } from '../../../hooks/useEvents'
import BusinessEventListing from '../../business/businessEventListing';

const UpcomingManagement = ({ business_name, business_id }) => {
    const { data: events_list, isLoading } = useEventsQuery()

    if(isLoading) {
        return <div>loading...</div>
    }

    const upcoming_events = events_list.data.filter(event => event.brand_id === business_id || event.venue_id === business_id)

    
    return (
        <div>
            {
                (upcoming_events.length > 0) &&
                    <BusinessEventListing event_list={upcoming_events} business_name={business_name} />
            }
        </div>
    )
}

export default UpcomingManagement;