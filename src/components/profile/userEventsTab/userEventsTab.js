import React from 'react';

import UserEvents from '../../events/eventListing/user.events';
import CreateEventButton from '../../events/buttons/createEventButton';

const UserEventsTab = () => {


    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h6>Calendar</h6>
                <CreateEventButton />
            </div>
            <UserEvents />
        </div>
    )
}

export default UserEventsTab;