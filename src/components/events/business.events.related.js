import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useBusinessEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import ServerReturnError from '../serverReturnError';
import EventCard from './views/event.card';
import EventSmallPreview from './views/event.small.preview';

const BusinessEventsRelatedStyles = styled.div`
    .businessEventsRelatedWrapper {
        margin: 0.5rem;
    }

    .businessEventsRelatedHeader {
        padding-left: 0.75rem;
        margin: 0.5rem 0;
    }
`;

const BusinessEventsRelated = ({ business_id }) => {
    const { data: business_events_list, status, error } = useBusinessEventsQuery(business_id);
    let business_events = {}
    let location = useLocation()


    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        console.log(error)
        return <ServerReturnError />
    }

    business_events = business_events_list.data

    return (
        <BusinessEventsRelatedStyles>
            <div className='businessEventsRelatedWrapper'>
                {
                    (business_events.length > 0)
                        ? <div>
                            <div className='businessEventsRelatedHeader subheaderText'>Upcoming Events</div>
                            {
                                business_events.map(event => {
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