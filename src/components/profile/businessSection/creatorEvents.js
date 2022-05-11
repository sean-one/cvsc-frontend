import React, { useContext } from 'react';
import { Row } from 'react-bootstrap';

import { UsersContext } from '../../../context/users/users.provider';
import useEventsFilter from '../../../hooks/useEventsFilter';
import EventPreview from '../../events/eventPreview.jsx';

const CreatorEvents = () => {
    const { useBusinessAdminIdRoles, userProfile } = useContext(UsersContext)
    const businessAdminIds = useBusinessAdminIdRoles()
    const adminEvents = useEventsFilter({ remove_user_id: userProfile.id, business_ids: businessAdminIds })

    // console.log(adminEvents)

    return (
        <Row>
            {
                adminEvents.map((event, i) => {
                    return (
                        <EventPreview key={event.event_id} event={event} />
                    )
                })
            }
        </Row>
    )
}

export default CreatorEvents;