import React from 'react';

import { useEventsQuery } from '../../../hooks/useEvents';
import BusinessEventListing from '../../business/businessEventListing';


const UpcomingBusiness = ({ business_name, business_id }) => {
    const { data: events, isLoading } = useEventsQuery()

    if (isLoading) {
        return <div>loading..</div>
    }

    const business_events = events.data.filter(event => event.brand_id === business_id || event.venue_id === business_id)

    return (
        <>
            {
                (business_events.length > 0) && (
                    <BusinessEventListing event_list={business_events} business_name={business_name} />
                )
            }
        </>
    )
}

export default UpcomingBusiness;