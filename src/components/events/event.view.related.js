import React from 'react';
import styled from 'styled-components';

import { useEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import ServerReturnError from '../serverReturnError';
import EventSmallPreview from './views/event.small.preview';

const EventViewRelatedStyles = styled.div`
    .eventViewRelatedWrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0 auto;
    }

    .eventViewRelatedHeader {
        padding-left: 0.75rem;
        margin: 0.5rem 0;
    }
`;

const EventViewRelated = ({ event }) => {
    const { data: events, status, error } = useEventsQuery()
    let event_list

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        console.log(error)
        return <ServerReturnError />;
    }

    event_list = events.data.filter(e => business_ids.includes(e.venue_id) || business_ids.includes(e.brand_id))
    event_list = event_list.filter(e => e.event_id !== event_id)    


    return (
        <EventViewRelatedStyles>
            <div>
                {
                    (event_list.length > 0)
                        ? <div className='eventViewRelatedWrapper'>
                            <div className='subheaderText eventViewRelatedHeader'>Upcoming Related Events</div>
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