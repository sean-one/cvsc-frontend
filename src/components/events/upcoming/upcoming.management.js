import React from 'react';
import { Row } from 'react-bootstrap';

// import { SiteContext } from '../../../context/site/site.provider';
import { useEventsQuery } from '../../../hooks/useEvents'
import EventListing from '../eventListing';

const UpcomingManagement = ({ business_id, business_type }) => {
    const { data: events_list, isLoading } = useEventsQuery()
    // const { useEventsByRoles } = useContext(SiteContext);
    // const upcoming_events = useEventsByRoles(role_type, business_id)

    if(isLoading) {
        return <div>loading...</div>
    }

    const upcoming_events = events_list.data.filter(event => event.brand_id === business_id || event.venue_id === business_id)

    return (
        <Row className='m-2 px-0'>
            <h4>Upcoming Events</h4>
            <EventListing event_list={upcoming_events} business_type={business_type} />
        </Row>
    )
}

export default UpcomingManagement;