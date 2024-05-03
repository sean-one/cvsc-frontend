import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { useUserEventsQuery } from '../../../hooks/useEventsApi';
import EventSmallPreview from '../../events/views/event.small.preview';
import LoadingSpinner from '../../loadingSpinner';
import EventSorter from '../../events/eventSorter';

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

// sort events with inactive on top, sorted by date
// const sortEventsRelated = (array) => {
//     array.sort((a,b) => {
//         if (a.active_event !== b.active_event) {
//             return a.active_event ? 1 : -1;
//         }

//         return new Date(a.eventdate) - new Date(b.eventdate)
//     });
// };

const UserEventsRelated = () => {
    const [sortCriteria, setSortCriteria] = useState('eventdate') // default sort by
    const [searchQuery, setSearchQuery] = useState('');

    const { auth, user_reset } = useAuth()
    const { dispatch } = useNotification();
    const { data: user_events, isPending, isError, error: user_events_error } = useUserEventsQuery(auth?.user?.id)
    
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

    const filteredEvents = user_events?.data.filter(event =>
        event?.business_name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
        event?.eventname.toLowerCase().includes(searchQuery.toLocaleLowerCase())
    ) || []

    const sortedEventList = [...filteredEvents].sort((a, b) => {
        switch (sortCriteria) {
            case 'eventdate':
            default:
                if (a.eventdate < b.eventdate) return -1;
                if (a.eventdate > b.eventdate) return 1;

                if (a.eventstart < b.eventstart) return -1;
                if (a.eventstart > b.eventstart) return 1;

                return 0;
            case 'active_event':
                if (a.active_event && !b.active_event) return -1;
                if (!a.active_event && b.active_event) return 1;
                return 0;
            case 'inactive_event':
                if (!a.active_event && b.active_event) return -1;
                if (a.active_event && !b.active_event) return 1;
                return 0;
        }
    })

    // user_events_list = user_events?.data || []
    // sortEventsRelated(user_events_list)

    return (
        <UserEventsRelatedStyles>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : (
                    <div className='userEventsList'>
                        <EventSorter
                            sortCriteria={sortCriteria}
                            onSortChange={setSortCriteria}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                        {
                            (user_events?.data.length > 0)
                                ? sortedEventList.map(event => {
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
                )
            }
        </UserEventsRelatedStyles>
    )
}

export default UserEventsRelated;