import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Row } from 'react-bootstrap';

import EventPreview from '../../events/eventPreview';

import { UsersContext } from '../../../context/users/users.provider';
import useEventsFilter from '../../../hooks/useEventsFilter';

const UserEvents = () => {
    const { userProfile } = useContext(UsersContext)
    const userEvents = useEventsFilter({ user_id: userProfile.id })

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