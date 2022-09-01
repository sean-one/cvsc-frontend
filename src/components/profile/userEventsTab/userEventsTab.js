import React from 'react';

import UpcomingCreatedBy from '../../events/upcoming/upcoming.created_by';
import EventsInactiveList from '../../events/eventsInactiveList';


const UserEventsTab = ({ user_events }) => {
    const upcoming_events = user_events.filter(event => event.active_event)
    const inactive_events = user_events.filter(event => !event.active_event)

    return (
        <div>
            <h6>Calendar</h6>
            {
                (upcoming_events.length > 0) &&
                    <UpcomingCreatedBy event_list={upcoming_events} />
            }
            {
                (inactive_events.length > 0) &&
                    <EventsInactiveList event_list={inactive_events} />
            }
        </div>
    )
}

export default UserEventsTab;