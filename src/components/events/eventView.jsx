import React from 'react'
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap'
import { format } from 'date-fns'

import { formatTime } from '../../helpers/formatTime';
import { useEventQuery, useEventsQuery } from '../../hooks/useEvents';
import useAuth from '../../hooks/useAuth';

import LoadingSpinner from '../loadingSpinner';
import EventList from './eventList';
import BusinessInfo from '../business/business_info';
import { EditButton } from '../menu/buttons/edit.button';
// import EventControls from './eventControls';

const EventView = () => {
    const { auth } = useAuth()
    let { event_id } = useParams()
    
    // let venue_role, brand_role = 'none'
    let brand_event_list, venue_event_list, both_event_list = []

    const { data: event, isLoading: eventLoading, isSuccess: eventSuccess } = useEventQuery(event_id)
    const { data: events, isLoading: listLoading, isSuccess: listSuccess } = useEventsQuery()

    if (eventLoading || listLoading) {
        return <LoadingSpinner />
    }

    if (eventSuccess && listSuccess) {
        brand_event_list = events.data.filter(e => e.brand_id === event.data.brand_id && e.event_id !== event.data.event_id)
        venue_event_list = events.data.filter(e => e.venue_id === event.data.venue_id && e.event_id !== event.data.event_id)
        both_event_list = events.data.filter(e => (e.venue_id === event.data.venue_id || e.brand_id === event.data.brand_id) && e.event_id !== event.data.event_id)
    }
    
    // if(auth?.roles) {
    //     // set roles for venue and brand
    //     venue_role = auth?.roles.find(role => role?.business_id === event.data.venue_id) || 'none'
    //     brand_role = auth?.roles.find(role => role?.business_id === event.data.brand_id) || 'none'
    // }


    return (
        <div>
            <div>
                <div>
                    {
                        (auth?.user?.id === event.data.created_by) &&
                            <EditButton name='edit_event' edit_id={event_id} />
                    }
                    <h2>{event.data.eventname.toUpperCase()}</h2>
                </div>
                <div className='d-flex justify-content-between fw-bold fst-italic'>
                    <div>
                        {format(new Date(event.data.eventdate), 'E, MMMM d')}
                    </div>
                    <div>
                        {`${formatTime(event.data.eventstart)} - ${formatTime(event.data.eventend)}`}
                    </div>
                </div>
                <div className='my-1'>
                    <Image fluid src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${event.data.eventmedia}`} alt={event.data.eventname} className='w-100' />
                </div>
                {/* brand and venue names and links */}
                <div className='d-flex'>
                    <BusinessInfo business_id={event.data.venue_id} business_name={event.data.venue_name} borderside='end' business_type='venue' />
                    <BusinessInfo business_id={event.data.brand_id} business_name={event.data.brand_name} business_type='brand' reverse />
                </div>
                <div className='fs-6 lh-sm mt-1 pt-2 border-top'>
                    {event.data.details}
                </div>
                {/* {
                    (auth?.user?.id === event.data.created_by) &&
                        <EventControls event={event.data} />
                } */}
            </div>
            <div>
                {
                    (event.data.brand_id === event.data.venue_id)
                        ? <EventList event_list={both_event_list} business_name={event.data.brand_name} />
                        : <div>
                            <EventList event_list={brand_event_list} business_name={event.data.brand_name} />
                            <EventList event_list={venue_event_list} business_name={event.data.venue_name} />
                        </div>
                }
            </div>
        </div>
    )
}

export default EventView