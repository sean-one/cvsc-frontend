import React from 'react';
import { Row } from 'react-bootstrap';

import { useEventsQuery } from '../../../hooks/useEvents'
import EventListing from '../eventListing';

const UpcomingManagement = ({ business_id }) => {
    const { data: events_list, isLoading } = useEventsQuery()

    if(isLoading) {
        return <div>loading...</div>
    }

    const upcoming_events = events_list.data.filter(event => event.brand_id === business_id || event.venue_id === business_id)

    return (
        <Row className='m-0 px-0'>
            <h4>Upcoming Events</h4>
            <EventListing event_list={upcoming_events} />
        </Row>
    )
}

export default UpcomingManagement;