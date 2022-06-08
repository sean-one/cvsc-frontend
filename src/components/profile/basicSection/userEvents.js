import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Row } from 'react-bootstrap';

import EventPreview from '../../events/eventPreview';

import { SiteContext } from '../../../context/site/site.provider';
import { UsersContext } from '../../../context/users/users.provider';

const UserEvents = () => {
    const { userProfile } = useContext(UsersContext)
    const { useEventsByUser } = useContext(SiteContext);
    const userEvents = useEventsByUser(userProfile.id)

    return (
        <Row>
            {
                userEvents.map((event, i) => {
                    return (
                        <EventPreview key={event.event_id} event={event} />
                    )
                })
            }
        </Row>
    )
}

export default withRouter(UserEvents);