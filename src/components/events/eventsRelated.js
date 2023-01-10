import React from 'react';

import { useEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import EventListPreview from './cardViews/eventListPreview';

const EventsRelated = ({ business_ids, event_id=false }) => {
    const { data: events, isLoading, isSuccess } = useEventsQuery()
    let event_list

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isSuccess) {
        event_list = events.data.filter(e => business_ids.includes(e.venue_id) || business_ids.includes(e.brand_id) )
    }

    if(event_id) {
        event_list = event_list.filter(e => e.event_id !== event_id)
    }

    return(
        <div className='border-top my-2'>
            {
                (event_list.length > 0) &&
                    <div className='mt-3'>
                        <h6>Upcoming Related Events</h6>
                        {
                            event_list.map(event => {
                                return (
                                    <EventListPreview key={event.event_id} event={event} />
                                )
                            })
                        }
                    </div>
            }
        </div>
    )
}

export default EventsRelated;