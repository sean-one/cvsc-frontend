import React from 'react'
import { format } from 'date-fns';

import './eventCard.css';

const EventCard = (props) => {
    const singleEvent = props.location.state.event;
    console.log(singleEvent)
    return (
        <div className='eventWrapper'>
            <h1>{singleEvent.eventName}</h1>
            <div>{format(singleEvent.eventStart, 'MMMM d Y')}</div>
            <div>{`${format(singleEvent.eventStart, 'h:mmaaa')} - ${format(singleEvent.eventEnd, 'h:mmaaa')}`}</div>
            <div>
                <img src={singleEvent.eventImage} alt='temp for display help'/>
            </div>
            <div>{singleEvent.eventLocation}</div>
            <div>{singleEvent.eventDetails}</div>
        </div>
    )
}

export default EventCard;
