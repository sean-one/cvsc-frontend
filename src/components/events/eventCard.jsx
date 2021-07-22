import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';

import EventCardUpcoming from './eventCardUpcoming/eventCardUpcoming.js';
import AxiosInstance from '../../helpers/axios';
import formatTime from '../../helpers/formatTime.js';

import './eventCard.css';


const EventCard = (props) => {
    const [singleEvent, setSingleEvent] = useState(props.location.state.event);
    const eventDate = new Date(singleEvent.eventdate);

    useEffect(() => {
        AxiosInstance.get(`/events/${props.match.params.id}`)
            .then(event => setSingleEvent(event.data))
        window.scrollTo(0,0);
        // eslint-disable-next-line
    }, [props.match.params.id]);

    return (
        <div className='eventWrapper'>
            <div className='singleEvent'>
                <h2>{singleEvent.eventname}</h2>
                <div className='datetimeInfo'>
                    <div>{format(eventDate, 'MMMM d, Y')}</div>
                    <div>{`${formatTime(singleEvent.eventstart)} - ${formatTime(singleEvent.eventend)}`}</div>
                </div>
                <div className='imageWrapper'>
                    <img src={singleEvent.eventmedia} alt='temp for display help'/>
                </div>
                <div className='addressInfo'>
                    <p>{singleEvent.formatted}</p>
                </div>
                <div>{singleEvent.details}</div>
            </div>
            <EventCardUpcoming event={singleEvent} />
        </div>

    )
}

export default EventCard;
