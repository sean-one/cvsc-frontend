import React, { useContext } from 'react';

import EventList from '../../events/eventList';
import { UsersContext } from '../../../context/users/users.provider';
import { useUserEventsQuery } from '../../../hooks/useEvents';
import CreateEventButton from '../../events/buttons/createEventButton';

const UserEventsTab = () => {
    const { userProfile } = useContext(UsersContext);
    const { data: userEventList, isLoading, isSuccess } = useUserEventsQuery(userProfile.id)
    let active_events_list
    let inactive_events_list

    if(isLoading) {
        return <div>loading...</div>
    }

    if(isSuccess) {
        active_events_list = userEventList.data.filter(event => event.active_event)
        inactive_events_list = userEventList.data.filter(event => !event.active_event)
    }


    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h6>Calendar</h6>
                <CreateEventButton />
            </div>
            {
                (active_events_list.length > 0) &&
                    <EventList event_list={active_events_list} />
            }
            {
                (inactive_events_list.length > 0) &&
                    <div className='pt-3'>
                        <h6>Inactive Events</h6>
                    </div>
            }
            {
                (inactive_events_list.length > 0) &&
                    <EventList event_list={inactive_events_list} />
            }
        </div>
    )
}

export default UserEventsTab;