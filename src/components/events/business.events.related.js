import React, { useEffect } from 'react';
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
    const { data: business_events_list, isPending, isError, error: business_events_list_error } = useBusinessEventsQuery(business_id);
    let location = useLocation()

    useEffect(() => {
    
        if (isError) {
            // 400 - type 'business_id'
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: business_events_list_error?.response?.data?.error?.message
                }
            })
        }
    }, [isError, business_events_list_error, dispatch])


    return (
        <BusinessEventsRelatedStyles>
            <div className='businessEventsRelatedWrapper'>
                {
                    isPending ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        null
                    ) :
                        (business_events_list?.data.length > 0)
                            ? <div>
                                <div className='businessEventsRelatedHeader subheaderText'>Upcoming Events</div>
                                {
                                    business_events_list?.data.map(event => {
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