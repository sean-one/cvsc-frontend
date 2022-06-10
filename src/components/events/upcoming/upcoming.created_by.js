import React, { useContext } from 'react';
import { Row } from 'react-bootstrap';

import { SiteContext } from '../../../context/site/site.provider';
import EventPreview from '../eventPreview';

const UpcomingCreatedBy = ({ user_id }) => {
    const { useEventsByUser } = useContext(SiteContext);
    const user_events = useEventsByUser(user_id)

    return (
        <Row>
            {
                user_events.map((event, i) => {
                    return (
                        <EventPreview key={event.event_id} event={event} />
                    )
                })
            }
        </Row>
    )
}

export default UpcomingCreatedBy;