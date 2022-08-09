import React, { useContext } from 'react';
// import { Row } from 'react-bootstrap';

import { useEventsQuery } from '../../../hooks/useEvents';
import { UsersContext } from '../../../context/users/users.provider';
import EventListing from '../eventListing';

const UpcomingCreatedBy = () => {
    const { data: events, isLoading } = useEventsQuery()
    const { userProfile } = useContext(UsersContext)

    if(isLoading) {
        return <div>loading...</div>
    }

    const user_events = events.data.filter(event => event.created_by === userProfile.id)

    return (
        <div>
            <h6>Calendar</h6>
            <EventListing event_list={user_events} />
        </div>
    )
}

export default UpcomingCreatedBy;