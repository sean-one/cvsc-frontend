import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import { formatTime } from '../../../helpers/formatTime';

import BusinessBrand from '../../business/business_brand';
import BusinessVenue from '../../business/business_venue';


const EventCalendarPreview = ({ event }) => {

    
    return (
        <div className='bg-light rounded my-3 shadow-sm p-1'>
            <Link to={{
                    pathname: `/event/${event.event_id}`
                }}
            >
                <img src={event.eventmedia} alt={`${event.eventname} information`} className='img-fluid w-100' />
                <div className='fw-bold lh-sm fs-5'>{event.eventname.toUpperCase()}</div>
            </Link>
            <div className='d-flex justify-content-between px-1 border-bottom fst-italic'>
                <div>{format(new Date(event.eventdate), 'E, MMM d')}</div>
                <div>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
            </div>
            <div className='d-flex justify-content-between px-1'>
                <BusinessVenue venue_id={event.venue_id} venue_name={event.venue_name} borderside='end'/>
                <BusinessBrand brand_id={event.brand_id} brand_name={event.brand_name} reverse />
            </div>
        </div> 
    )
}

export default EventCalendarPreview;