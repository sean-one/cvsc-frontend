import React, { useContext } from 'react';
import { Row } from 'react-bootstrap';

import { SiteContext } from '../../../context/site/site.provider';
import EventListing from '../eventListing';

const UpcomingCreatedBy = ({ user_id }) => {
    const { useEventsByUser } = useContext(SiteContext);
    const user_events = useEventsByUser(user_id)

    return (
        <Row>
            <EventListing event_list={user_events} />
        </Row>
    )
}

export default UpcomingCreatedBy;