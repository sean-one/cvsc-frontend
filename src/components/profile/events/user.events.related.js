import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { useUserEventsQuery } from '../../../hooks/useEventsApi';
import EventSmallPreview from '../../events/views/event.small.preview';
import LoadingSpinner from '../../loadingSpinner';

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

// sort events with inactive on top, sorted by date
const sortEventsRelated = (array) => {
    array.sort((a,b) => {
        if (a.active_event !== b.active_event) {
            return a.active_event ? 1 : -1;
        }

        return new Date(a.eventdate) - new Date(b.eventdate)
    });
};

const UserEventsRelated = () => {
    const { auth } = useAuth()
    const { data: user_events, status: user_events_status } = useUserEventsQuery(auth?.user?.id)
    let user_events_list = []
    
    let navigate = useNavigate()

    useEffect(() => {
        if (user_events_status === 'error') {
            navigate('/profile')
        }
    }, [navigate, user_events_status])

    if (user_events_status === 'loading') {
        return <LoadingSpinner />
    }

    user_events_list = user_events?.data || []
    sortEventsRelated(user_events_list)

    
    return (
        <UserEventsRelatedStyles>
            {
                (user_events_list.length > 0)
                    ? user_events_list.map(event => {
                        return (
                            <EventSmallPreview key={event.event_id} event={event} />
                        )
                    })
                    : <div className='noUserEvents'>
                        <div>You have no upcoming created events</div>
                        <div className='noUserEventsLink' onClick={() => navigate('/event/create')}>Create a new event!</div>
                    </div>
            }
        </UserEventsRelatedStyles>
    )
}

export default UserEventsRelated;