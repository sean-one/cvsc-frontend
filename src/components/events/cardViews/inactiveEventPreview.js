import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import { Image } from 'react-bootstrap';

import { image_link } from '../../../helpers/dataCleanUp'

const InactiveListPreview = ({ event }) => {
    let navigate = useNavigate()

    const textTruncation = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }


    return (
        <div className='bg-light rounded my-3 p-1 shadow-sm' onClick={() => navigate(`/event/edit/${event.event_id}`)}>
            <h4 className='text-truncate my-1'>{event.eventname.toUpperCase()}</h4>
            {/* event date information */}
            <div className='d-flex justify-content-between border-bottom my-1'>
                <div>
                    {format(new Date(event.eventdate), 'E, MMM do')}
                </div>
                <div>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
            </div>
            {/* event image & details */}
            <div className='d-flex align-items-center my-1'>
                <div className='w-50'>
                    <Image src={image_link(event.eventmedia)} thumbnail />
                </div>
                <div className='w-75 d-flex flex-column ps-1'>
                    <div className='lh-sm fs-6'>
                        {textTruncation(event.details, 95) || ''}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InactiveListPreview;