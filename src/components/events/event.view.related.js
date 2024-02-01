import React, { useEffect } from 'react';
import styled from 'styled-components';

import useNotification from '../../hooks/useNotification';
import { useEventRelatedEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import EventSmallPreview from './views/event.small.preview';

const EventViewRelatedStyles = styled.div`
    .eventViewRelatedWrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0 auto;
    }

    .eventViewRelatedHeader {
        padding-left: 1.125rem;
        margin: 0.75rem 0;
    }
`;

const EventViewRelated = ({ event_id }) => {
    const { dispatch } = useNotification();
    const { data: event_related_events, status: event_related_events_status, error: event_related_events_error } = useEventRelatedEventsQuery(event_id)
    let events_related_list = []

    useEffect(() => {
        if (event_related_events_status === 'error') {
            dispatch({
                typpe: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: event_related_events_error?.response?.data?.error?.message
                }
            })
        }
    }, [dispatch, event_related_events_status, event_related_events_error])

    if (event_related_events_status === 'loading') {
        return <LoadingSpinner />
    }

    events_related_list = event_related_events?.data || []


    return (
        <EventViewRelatedStyles>
            <div>
                {
                    (events_related_list.length > 0)
                        ? <div className='eventViewRelatedWrapper'>
                            <div className='subheaderText eventViewRelatedHeader'>Upcoming Related Events</div>
                            {
                                event_related_events?.data.map(event => {
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