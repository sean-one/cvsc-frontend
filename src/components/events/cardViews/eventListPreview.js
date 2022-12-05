import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import { Image } from 'react-bootstrap';

import EventControls from '../eventControls';
import { image_link } from '../../../helpers/dataCleanUp';
import BusinessBrand from '../../business/business_brand';
import BusinessVenue from '../../business/business_venue';

const EventListPreview = ({ event, inactive }) => {
    let { pathname } = useLocation()

    const textTruncation = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }
    

    return (
        <div className='bg-light rounded my-3 p-1 shadow-sm'>
            {/* event header */}
            {
                inactive
                    ? <h4 className='text-truncate my-1'>{event.eventname.toUpperCase()}</h4>
                    : <Link to={{
                        pathname: `/event/${event.event_id}`,
                        state: {
                            event,
                            from: pathname
                        }
                    }}><h4 className='text-truncate my-1'>{event.eventname.toUpperCase()}</h4></Link>
            }
            {
                inactive && <EventControls event={event} inactive />
            }
            
            {/* event date information */}
            <div className='d-flex justify-content-between border-bottom my-1'>
                <div>
                    {format(new Date(event.eventdate), 'E, MMM do')}
                </div>
                {
                    (event.eventstart && event.eventend) &&
                        <div>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
                }
            </div>

            {/* event image & details */}
            <div className='d-flex align-items-center my-1'>
                {
                    (event.eventmedia) &&
                        <div className='w-50'>
                            <Image src={image_link(event.eventmedia)} thumbnail />
                        </div>
                }
                <div className='w-75 d-flex flex-column ps-1'>
                    {
                        (event.venue_id) &&
                            <BusinessVenue venue_id={event.venue_id} venue_name={event.venue_name} />
                    }
                    {
                        (event.brand_id) &&
                            <BusinessBrand brand_id={event.brand_id} brand_name={event.brand_name} />
                    }
                    {
                        (event.details) &&
                            <div className='lh-sm fs-6'>
                                {textTruncation(event.details, 95) || ''}
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default EventListPreview;