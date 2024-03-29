import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import useNotification from '../../hooks/useNotification';
import { useBusinessEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import EventCard from './views/event.card';
import EventSmallPreview from './views/event.small.preview';

const BusinessEventsRelatedStyles = styled.div`
    .businessEventsRelatedWrapper {
        margin: 0.75rem;
    }

    .businessEventsRelatedHeader {
        padding-left: 1.125rem;
        margin: 0.75rem 0;
    }
`;

const BusinessEventsRelated = ({ business_id }) => {
    const { dispatch } = useNotification();
    const { data: events_list, isPending, isError, error: events_list_error } = useBusinessEventsQuery(business_id);
    let location = useLocation();
    let business_events_list = []

    if (isError) {
        // 400 - type 'business_id', 'server'
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: events_list_error?.response?.data?.error?.message
            }
        })
    }

    business_events_list = events_list?.data || []

    return (
        <BusinessEventsRelatedStyles>
            <div className='businessEventsRelatedWrapper'>
                {
                    isPending ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        null
                    ) :
                        (business_events_list.length > 0)
                            ? <div>
                                <div className='businessEventsRelatedHeader subheaderText'>Upcoming Events</div>
                                {
                                    business_events_list.map(event => {
                                        if (location.pathname.includes('admin')) {
                                            return (
                                                <EventSmallPreview key={event.event_id} event={event} />
                                            )
                                        } else {
                                            return (
                                                <EventCard key={event.event_id} event={event} />
                                            )
                                        }
                                    })
                                }
                            </div>
                            : null
                }
            </div>
        </BusinessEventsRelatedStyles>
    )
}

export default BusinessEventsRelated;