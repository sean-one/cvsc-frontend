import React from 'react';

import LoadingSpinner from '../../loadingSpinner';
import { useBusinessEventsQuery } from '../../../hooks/useEventsApi';

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
        <div className='sectionContainer'>
            {
                (eventsList.data.length > 0)
                    ? <div>
                        <div>{`${business_name} Upcoming Events`}</div>
                        {
                            eventsList.data.map(event => (
                                <div key={event.event_id}>
                                    <div>{`01/01 | ${event.eventname} | ${event.eventstart}-${event.eventend}`}</div>
                                </div>
                            ))
                        }
                    </div>
                    : <div>no current events, create one!</div>
            }
        </div>
    )
}

export default BusinessEvents;