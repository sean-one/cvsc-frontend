import React from 'react';
import { useParams } from 'react-router-dom';

import UserEvents from '../../events/eventListing/user.events';
import CreateEventButton from '../../events/buttons/createEventButton';

const UserEventsTab = () => {
    const { user_id } = useParams()

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h6>Calendar</h6>
                <CreateEventButton />
            </div>
            <UserEvents user_id={user_id} />
        </div>
    )
}

export default UserEventsTab;