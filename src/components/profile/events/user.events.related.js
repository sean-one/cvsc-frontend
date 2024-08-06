import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import useAuth from '../../../hooks/useAuth';
import { useUserEventsQuery } from '../../../hooks/useEventsApi';
import EventSmallPreview from '../../events/views/event.small.preview';
import LoadingSpinner from '../../loadingSpinner';
import EventSearch from '../../events/eventSearch';

import useNotification from '../../../hooks/useNotification';

const UserEventsRelatedStyles = styled.div`
    .userEventsList {
        width: 100%;
        display: grid;
        padding: 0 0.25rem;
        grid-template-columns: minmax(1fr, var(--max-section-width));
        justify-content: center;
        align-items: center;
        gap: 1rem;

        @media (min-width: 768px) {
            grid-template-columns: 1fr 1fr;
        }

        &.singleUserEvent {
            @media (min-width: 768px) {
                grid-template-columns: 1fr;
                justify-items: center;
            }
        }
    }

    .eventSearchBox {
        padding: 0 2rem;

        @media (min-width: 768px) {
            grid-column: 1/3;
        }
    }

    .noUserEvents {
        width: 100%;
        grid-column: 1/3;
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

const UserEventsRelated = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const { auth, user_reset } = useAuth()
    const { dispatch } = useNotification();
    const { data: user_events, isPending, isError, error: user_events_error } = useUserEventsQuery(auth?.user?.id)
    
    let navigate = useNavigate()

    useEffect(() => {
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
    }, [isError, user_events_error, user_reset, dispatch, navigate])

    const filteredEvents = user_events?.data.filter(event =>
        event?.business_name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
        event?.eventname.toLowerCase().includes(searchQuery.toLocaleLowerCase())
    ) || []

    if (!user_events) { return null; }


    return (
        <UserEventsRelatedStyles>
            <Helmet>
                <title>CVSC - User Events</title>
            </Helmet>
            {
                (user_events?.data.length !== 0) &&
                    <div className='eventSearchBox'>
                        <EventSearch
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </div>
            }
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : (
                    <div className={`userEventsList ${user_events.data.length === 1 ? 'singleUserEvent' : ''}`}>
                        {
                            (filteredEvents.length > 0)
                                ? filteredEvents.map(event => {
                                    return (
                                        <EventSmallPreview key={event.event_id} event={event} />
                                    )
                                })
                                : <div>
                                    {
                                        (user_events?.data.length === 0)
                                            ? <div className='noUserEvents'>
                                                <div>You have no upcoming created events</div>
                                                <div className='noUserEventsLink' onClick={() => navigate('/event/create')}>Create a new event!</div>
                                            </div>
                                            : <div>No matching results</div>
                                    }
                                </div>
                        }
                    </div>
                )
            }
        </UserEventsRelatedStyles>
    )
}

export default UserEventsRelated;