import React from 'react';
import styled from 'styled-components';

import useNotification from '../../hooks/useNotification';
import { useEventRelatedEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import EventSmallPreview from './views/event.small.preview';

const EventViewRelatedStyles = styled.div`
    .eventViewRelatedWrapper {
        display: grid;
        padding: 0 0.25rem;
        gap: 1rem;
        width: 100%;
        max-width: var(--max-section-width);
        margin: 0 auto 1.5rem;
    }

    .eventViewRelatedHeader {
        color: var(--main-highlight-color);
        padding: 0.5rem 0 0.5rem 0.5rem;
        margin: 0.5rem 0;
    }
`;

const EventViewRelated = ({ event_id }) => {
    const { dispatch } = useNotification();
    const { data: event_related_events, isPending, isFetching, isError, error: event_related_events_error } = useEventRelatedEventsQuery(event_id)
    let events_list = []

    if (isError) {
        // 400 - type: 'event_id', 'server'
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: event_related_events_error?.response?.data?.error?.message
            }
        })
    }

    events_list = event_related_events?.data || []

    return (
        <EventViewRelatedStyles>
            <div>
                {
                    isPending ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        null
                    ) : 
                        (!isFetching && events_list.length > 0)
                        ? <div className='eventViewRelatedWrapper'>
                            <div className='subheaderText eventViewRelatedHeader'>Upcoming Related Events</div>
                            {
                                events_list.map(event => {
                                    return (
                                        <EventSmallPreview key={event.event_id} event={event} />
                                    )
                                })
                            }
                        </div>
                        : null
                }
            </div>
        </EventViewRelatedStyles>
    )
}

export default EventViewRelated;