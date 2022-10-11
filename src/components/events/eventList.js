import React from 'react';

import EventListPreview from './cardViews/eventListPreview';


const EventList = ({ event_list, business_name, inactive=false }) => {


    return (
        <div>
            {
                (business_name && event_list.length > 0) &&
                    <div className='pt-3'>
                        <h6>{`Upcoming ${business_name} events`}</h6>
                    </div>

            }
            {
                event_list.map(event => {
                    return (
                        <EventListPreview key={event.event_id} event={event} inactive={inactive} />
                    )
                })
            }
        </div>
    )
}

export default EventList;