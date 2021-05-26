import React from 'react'
import { format } from 'date-fns';

import './eventCard.css';

const EventCard = (props) => {
    const singleEvent = props.location.state.event;
    const eventStartTime = new Date(singleEvent.start)
    const eventEndTime = new Date(singleEvent.start)

    // upcoming location_id Events
    // upcoming brand_id Events
    return (
        <div className='eventWrapper'>
            <h1>{singleEvent.eventname}</h1>
            <div className='datetimeInfo'>
                <div>{format(eventStartTime, 'MMMM d, Y')}</div>
                <div>{`${format(eventStartTime, 'h:mmaaa')} - ${format(eventEndTime, 'h:mmaaa')}`}</div>
            </div>
            <div className='imageWrapper'>
                <img src={singleEvent.media} alt='temp for display help'/>
            </div>
            <div>{singleEvent.formatted}</div>
            <div>{singleEvent.details}</div>
        </div>
    )
}

export default EventCard;
