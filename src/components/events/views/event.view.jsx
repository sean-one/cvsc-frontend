import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../loadingSpinner';
import { formatTime } from '../../../helpers/formatTime';
import { useEventQuery } from '../../../hooks/useEventsApi';
import { image_link } from '../../../helpers/dataCleanUp';
import EventManagementMenu from '../management/event.management.menu';
import RelatedEvents from '../related.events';
import VenueLabel from '../../business/venue_label';
import BrandLabel from '../../business/brand_label';


const EventView = () => {
    const { auth } = useAuth()
    let { event_id } = useParams()
    let brand_role, venue_role = {}

    let navigate = useNavigate()
    
    const { data: event, isLoading } = useEventQuery(event_id)

    if (isLoading) {
        return <LoadingSpinner />
    }

    if(auth?.roles) {
        brand_role = auth.roles.find(role => role.business_id === event.data.brand_id)
        venue_role = auth.roles.find(role => role.business_id === event.data.venue_id)

        console.log('brand')
        console.log(brand_role)
        console.log('venue')
        console.log(venue_role)
    }


    return (
        <div>
            <div>
                <div className='d-flex align-items-center'>
                    <h2 className='w-100 mb-0'>{event.data.eventname.toUpperCase()}</h2>
                    {
                        (auth?.user?.id === event.data.created_by) &&
                            <div className='px-2'>
                                <FontAwesomeIcon icon={faPen} onClick={() => navigate(`/event/edit/${event?.data.event_id}`, { state: event?.data })}/>
                            </div>
                    }
                </div>
                <div>{`${event.data.street_address}, ${event.data.location_city}`}</div>
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
                {
                    ((venue_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && venue_role?.active_role === true) || (brand_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && brand_role?.active_role === true)) &&
                        <EventManagementMenu brand_role={brand_role} venue_role={venue_role} />
                }
                {/* brand and venue names and links */}
                <div className='d-flex'>
                    <VenueLabel venue_id={event.data.venue_id} venue_name={event.data.venue_name} />
                    <BrandLabel brand_id={event.data.brand_id} brand_name={event.data.brand_name} />
                </div>
                <div className='fs-6 lh-sm mt-1 pt-2 border-top'>
                    {event.data.details}
                </div>
            </div>
            <div>
                <RelatedEvents business_ids={[event.data.venue_id, event.data.brand_id]} event_id={event.data.event_id} />
            </div>
        </div>
    )
}

export default EventView