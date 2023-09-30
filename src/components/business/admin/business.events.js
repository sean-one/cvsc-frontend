import React from 'react';
import styled from 'styled-components';

import LoadingSpinner from '../../loadingSpinner';
import { useBusinessEventsQuery } from '../../../hooks/useEventsApi';
import EventSmallPreview from '../../events/views/event.small.preview';

const BusinessEventsStyles = styled.div`
    .businessEventsWrapper {
        padding: 0 0.5rem;
    }
`;

const BusinessEvents = ({ business_id, business_name }) => {
    const { data: eventsList, status } = useBusinessEventsQuery(business_id)

    if(status === 'error') {
        console.log('inside the error')
        return null
    }

    if(status === 'loading') {
        return <LoadingSpinner />
    }


    return (
        <BusinessEventsStyles>
            <div className='businessEventsWrapper'>
                {
                    (eventsList.data.length > 0)
                        ? <div>
                            <div>{`${business_name} Upcoming Events`}</div>
                            {
                                eventsList.data.map(event => {
                                    return (
                                        <EventSmallPreview key={event.event_id} event={event} business />
                                    )
                                })
                            }
                        </div>
                        : <div>no current events, create one!</div>
                }
            </div>

        </BusinessEventsStyles>
    )
}

export default BusinessEvents;