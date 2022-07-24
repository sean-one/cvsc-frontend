import React from 'react';

import { useEventsQuery } from '../../../hooks/useEvents';
import BusinessEventListing from '../../business/businessEventListing';


const UpcomingEvents = ({ event, venue_id, brand_id }) => {
    const { data: events, isLoading } = useEventsQuery()

    if (isLoading) {
        return <div>loading...</div>
    }

    const atVenue = events.data.filter(e => e.venue_id === venue_id && e.event_id !== event.event_id)
    const withBrand = events.data.filter(e => e.brand_id === brand_id && e.event_id !== event.event_id)

    
    return (
        <>
            <BusinessEventListing event_list={atVenue} business_name={event.venue_name} />
            <BusinessEventListing event_list={withBrand} business_name={event.brand_name} />
        </>
    )
}

export default UpcomingEvents;