import React from 'react';
import styled from 'styled-components';

import { useBusinessEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import ServerReturnError from '../serverReturnError';
import EventCard from './views/event.card';

const BusinessEventsRelatedStyles = styled.div`
    .businessEventsRelatedHeader {
        margin: 0.25rem 0;
    }
`;

const BusinessEventsRelated = ({ business_id }) => {
    const { data: business_events_list, status, error } = useBusinessEventsQuery(business_id);
    let business_events = {}


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
            <div>
                {
                    (business_events.length > 0)
                        ? <div>
                            <div className='businessEventsRelatedHeader'>Upcoming Events</div>
                            {
                                business_events.map(event => {
                                    return (
                                        <EventCard key={event.event_id} event={event} />
                                    )
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