import React from 'react';
import styled from 'styled-components';

import { useEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import EventSmallPreview from './views/event.small.preview';

const EventViewRelatedStyles = styled.div`
    .eventViewRelatedWrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        border: 1px solid red;
        margin: 0 auto;
        padding-top: 1.5rem;
    }
`;

const EventViewRelated = ({ business_ids, event_id }) => {
    const { data: events, isLoading, isSuccess } = useEventsQuery()
    let event_list

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isSuccess) {
        event_list = events.data.filter(e => business_ids.includes(e.venue_id) || business_ids.includes(e.brand_id))
        event_list = event_list.filter(e => e.event_id !== event_id)
    }


    return (
        <EventViewRelatedStyles>
            <div>
                {
                    (event_list.length > 0)
                        ? <div className='eventViewRelatedWrapper'>
                            <h6>Upcoming Related Events</h6>
                            {
                                event_list.map(event => {
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