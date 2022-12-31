import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClinicMedical, faCannabis } from '@fortawesome/free-solid-svg-icons';

import { formatTime } from '../../../helpers/formatTime';
import { image_link } from '../../../helpers/dataCleanUp';


const EventCalendarPreview = ({ event }) => {

    
    return (
        <div className='bg-light rounded my-3 shadow-sm p-1'>
            <div className='d-flex justify-content-between px-1 border-bottom fst-italic'>
                <div>{format(new Date(event.eventdate), 'E, MMM d')}</div>
                <div>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
            </div>
            <Link to={{
                    pathname: `/event/${event.event_id}`
                }}
            >
                <img src={image_link(event.eventmedia)} alt={`${event.eventname} information`} className='img-fluid w-100' />
                <div className='fw-bold lh-sm fs-5'>{event.eventname.toUpperCase()}</div>
            </Link>
            <div className='d-flex'>
                <div className='w-100'>
                    <FontAwesomeIcon icon={faClinicMedical} className='me-2' />
                    {event.venue_name}
                </div>
                <div className='w-100 text-end'>
                    {event.brand_name}
                    <FontAwesomeIcon icon={faCannabis} className='ms-2' />
                </div>
            </div>
        </div> 
    )
}

export default EventCalendarPreview;