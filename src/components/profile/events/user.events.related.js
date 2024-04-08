import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { useUserEventsQuery } from '../../../hooks/useEventsApi';
import EventSmallPreview from '../../events/views/event.small.preview';
import LoadingSpinner from '../../loadingSpinner';

import useNotification from '../../../hooks/useNotification';

const UserEventsRelatedStyles = styled.div`
    .userEventsList {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .noUserEvents {
        width: 100%;
        max-width: var(--max-section-width);
        margin: 1rem 0;
        padding-top: 0.75rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .noUserEventsLink {
        color: var(--main-highlight-color);
        padding: 0.75rem 0;
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
    const { auth, user_reset } = useAuth()
    const { dispatch } = useNotification();
    const { data: user_events, isPending, isError, error: user_events_error } = useUserEventsQuery(auth?.user?.id)
    let user_events_list = []
    
    let navigate = useNavigate()

    if (isError) {
        // 401, 403 - type 'token', 400 - type: 'user_id'
        if (user_events_error?.resposne?.status === 401 || user_events_error?.response?.status === 403) {
            // remove expired or bad token and reset user
            user_reset()
            
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: user_events_error?.response?.data?.error?.message
                }
            })

            navigate('/login')

        } else {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: user_events_error?.response?.data?.error?.message
                }
            })
        }
    }

    if (isPending) {
        return <LoadingSpinner />
    }

    user_events_list = user_events?.data || []
    sortEventsRelated(user_events_list)

    
    return (
        <UserEventsRelatedStyles>
            <div className='userEventsList'>
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
            </div>
        </UserEventsRelatedStyles>
    )
}

export default UserEventsRelated;