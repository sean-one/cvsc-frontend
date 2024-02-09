import React from 'react';
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
    const { data: event_related_events, isPending, isFetching, isError, error: event_related_events_error } = useEventRelatedEventsQuery(event_id)

    if (isError) {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: event_related_events_error?.response?.data?.error?.message
            }
        })
    }


    return (
        <EventViewRelatedStyles>
            <div>
                {
                    isPending ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        null
                    ) : 
                        (!isFetching && event_related_events?.data?.length > 0)
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