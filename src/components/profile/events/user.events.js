import React from 'react';
import styled from 'styled-components';

import { useUserEventsQuery } from '../../../hooks/useEventsApi';
import useAuth from '../../../hooks/useAuth';

import LoadingSpinner from '../../loadingSpinner';
import EventPreview from '../../events/views/event.preview';
// import InactiveListPreview from '../../events/views/inactive.preview';

const Styles = styled.div`
`;

const UserEvents = () => {
    const { auth } = useAuth()
    
    const { data: usersEvents, isLoading, isSuccess } = useUserEventsQuery(auth.user.id)
    let user_events = []
    // let inactive_events = []

    if(isLoading) { <LoadingSpinner /> }

    if(isSuccess) {
        user_events = usersEvents.data
        // active_events = usersEvents.data.filter(event => event.active_event)
        // inactive_events = usersEvents.data.filter(event => !event.active_event)
    }

    return (
        <Styles>
            <div>
                {
                    (user_events.length > 0) &&
                        user_events.map(event => {
                            return (
                                <EventPreview key={event.event_id} event={event} />
                            )
                        })
                }
                {/* {
                    (inactive_events.length > 0) &&
                        inactive_events.map(event => {
                            return (
                                <InactiveListPreview key={event.event_id} event={event} />
                            )
                        })
                } */}
            </div>
        </Styles>
    )
}

export default UserEvents;