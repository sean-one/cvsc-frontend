import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import { formatTime } from '../../../helpers/formatTime';
import { image_link } from '../../../helpers/dataCleanUp';

import BusinessInfo from '../../business/business_info';


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
                <BusinessInfo business_id={event.venue_id} business_name={event.venue_name} borderside='end' business_type='venue' />
                <BusinessInfo business_id={event.brand_id} business_name={event.brand_name} business_type='brand' reverse />
            </div>
        </div> 
    )
}

export default EventCalendarPreview;