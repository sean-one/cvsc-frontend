import React, { useContext } from 'react';
import { Row } from 'react-bootstrap';

import { SiteContext } from '../../../context/site/site.provider';
import EventListing from '../eventListing';

const UpcomingManagement = ({ business_id, business_type, role_type }) => {
    const { useEventsByRoles } = useContext(SiteContext);
    const upcoming_events = useEventsByRoles(role_type, business_id)

    return (
        <Row className='m-2 px-0'>
            <h4>Upcoming Events</h4>
            <EventListing event_list={upcoming_events} business_type={business_type} />
        </Row>
    )
}

export default UpcomingManagement;