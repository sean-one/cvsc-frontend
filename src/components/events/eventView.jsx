import React from 'react'
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap'
import { format } from 'date-fns'

import { formatTime } from '../../helpers/formatTime';
import { useEventQuery } from '../../hooks/useEvents';
import useAuth from '../../hooks/useAuth';

import LoadingSpinner from '../loadingSpinner';
import BusinessInfo from '../business/business_info';
import { EditEventButton } from '../menu/buttons/edit_event.button';
import { image_link } from '../../helpers/dataCleanUp';
import EventsRelated from './eventsRelated';


const EventView = () => {
    const { auth } = useAuth()
    let { event_id } = useParams()

    const { data: event, isLoading } = useEventQuery(event_id)

    if (isLoading) {
        return <LoadingSpinner />
    }


    return (
        <div>
            <div>
                <div className='d-flex align-items-center'>
                    {
                        (auth?.user?.id === event.data.created_by) &&
                            <div className='px-2'>
                                <EditEventButton event={event.data}/>
                            </div>
                    }
                    <h2 className='w-100'>{event.data.eventname.toUpperCase()}</h2>
                </div>
                <div>{event.data.formatted}</div>
                <div className='d-flex justify-content-between fw-bold fst-italic'>
                    <div>
                        {format(new Date(event.data.eventdate), 'E, MMMM d')}
                    </div>
                    <div>
                        {`${formatTime(event.data.eventstart)} - ${formatTime(event.data.eventend)}`}
                    </div>
                </div>
                <div className='my-1 position-relative'>
                    <Image fluid src={image_link(event.data.eventmedia)} alt={event.data.eventname} className='w-100' />
                </div>
                {/* brand and venue names and links */}
                <div className='d-flex'>
                    <BusinessInfo business_id={event.data.venue_id} business_name={event.data.venue_name} borderside='end' business_type='venue' />
                    <BusinessInfo business_id={event.data.brand_id} business_name={event.data.brand_name} business_type='brand' reverse />
                </div>
                <div className='fs-6 lh-sm mt-1 pt-2 border-top'>
                    {event.data.details}
                </div>
            </div>
            <div>
                <EventsRelated business_ids={[event.data.venue_id, event.data.brand_id]} event_id={event.data.event_id} />
            </div>
        </div>
    )
}

export default EventView