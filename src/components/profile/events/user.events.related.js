import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { useUserEventsQuery } from '../../../hooks/useEventsApi';
import EventSmallPreview from '../../events/views/event.small.preview';
import LoadingSpinner from '../../loadingSpinner';
import ServerReturnError from '../../serverReturnError';

const UserEventsRelatedStyles = styled.div`
    .noUserEvents {
        border-top: 0.01rem dotted var(--main-text-color);
        padding-top: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .noUserEventsLink {
        padding: 0.5rem 0;
        font-weight: bold;
        cursor: pointer;
        
    }
`;

const UserEventsRelated = () => {
    const { auth } = useAuth()
    const { data: user_events_list, status } = useUserEventsQuery(auth?.user?.id)
    let user_events = {}
    
    let navigate = useNavigate()

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        return <ServerReturnError />
    }

    const createNewEvent = () => {
        navigate('/event/create')
    }

    user_events = user_events_list.data

    return (
        <UserEventsRelatedStyles>
            {
                (user_events.length > 0)
                    ? user_events.map(event => {
                        return (
                            <EventSmallPreview key={event.event_id} event={event} />
                        )
                    })
                    : <div className='noUserEvents'>
                        <div>You have no upcoming created events</div>
                        <div className='noUserEventsLink' onClick={() => createNewEvent()}>Create a new event!</div>
                    </div>
            }
        </UserEventsRelatedStyles>
    )
}

export default UserEventsRelated;