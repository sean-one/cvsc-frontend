import React from 'react';

import EventList from '../../events/eventList';
import CreateEventButton from '../../events/buttons/createEventButton';

const UserEventsTab = ({ user_events }) => {
    const upcoming_events = user_events.filter(event => event.active_event)
    const inactive_events = user_events.filter(event => !event.active_event)

    console.log(upcoming_events)
    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h6>Calendar</h6>
                <CreateEventButton />
            </div>
            {
                (upcoming_events.length > 0) &&
                    <EventList event_list={upcoming_events} />
            }
            {
                (inactive_events.length > 0) &&
                    <div className='pt-3'>
                        <h6>Inactive Events</h6>
                    </div>
            }
            {
                (inactive_events.length > 0) &&
                    <EventList event_list={inactive_events} />
            }
        </div>
    )
}

export default UserEventsTab;