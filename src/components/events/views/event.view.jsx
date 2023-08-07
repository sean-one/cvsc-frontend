import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns'
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../loadingSpinner';
import { formatTime } from '../../../helpers/formatTime';
import { useEventQuery } from '../../../hooks/useEventsApi';
import { image_link } from '../../../helpers/dataCleanUp';
import EventViewRelated from '../event.view.related';

const EventViewStyles = styled.div`

    .eventViewWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        
        @media (min-width: 768px) {
            padding: 0.75rem;
        }
    }

    .eventViewHeaderRow {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    
    .eventViewEventname {
        flex-grow: 1;
        font-size: 1.6rem;
        line-height: 1.2;
        font-weight: bold;
        text-transform: uppercase;
    }

    .eventViewEditButton {
        flex-shrink: 0;
    }
    
    .eventViewAddress {
        align-self: flex-start;
    }

    .eventViewDateWrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        font-style: italic;
    }
    
    .eventViewBody {
        width: 100%;
        display: flex;
        flex-direction: column;

        @media (min-width: 768px) {
            flex-direction: row;
        }
    }
    
    .eventViewImageContainer {
        width: 100%;
        max-width: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.75rem auto;

        @media (min-width: 768px) {
            margin: 0.5rem;
        }
    }
    
    .eventViewImage {
        width: 100%;
        border: 1px solid var(--image-border-color);
        display: block;
    }

    .eventViewDetails {
        align-self: center;
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    
        @media (min-width: 768px) {
            padding-top: 0;
            padding-left: 1rem;
        }
    }

    .eventViewBusiness {
        margin: 0.25rem;
        font-size: 1.2rem;
        font-weight: bold;
    }
`;


const EventView = () => {
    const { auth } = useAuth()
    let { event_id } = useParams()

    let navigate = useNavigate()
    
    const { data: event, isLoading } = useEventQuery(event_id)

    if (isLoading) {
        return <LoadingSpinner />
    }


    return (
        <EventViewStyles>
            <div className='eventViewWrapper'>
                <div className='eventViewHeaderRow'>
                    <div className='eventViewEventname'>{event.data.eventname}</div>
                    {
                        (auth?.user?.id === event.data.created_by) &&
                            <button onClick={() => navigate(`/event/edit/${event?.data.event_id}`, { state: event?.data })}>edit</button>
                    }
                </div>
                <div className='eventViewAddress'>{event.data.venue_location}</div>
                <div className='eventViewDateWrapper'>
                    <div>{format(new Date(event.data.eventdate), 'E, MMMM d')}</div>
                    <div>{`${formatTime(event.data.eventstart)} - ${formatTime(event.data.eventend)}`}</div>
                </div>
                <div className='eventViewBody'>
                    <div className='eventViewImageContainer'>
                        <img className='eventViewImage' src={image_link(event.data.eventmedia)} alt={event.data.eventname} />
                    </div>
                    <div className='eventViewDetails'>
                        <div>{event.data.details}</div>
                        <div>
                            <div className='eventViewBusiness' onClick={() => navigate(`/business/${event.data.venue_id}`)}>
                                {`Location: ${event.data.venue_name}`}
                            </div>
                            <div className='eventViewBusiness' onClick={() => navigate(`/business/${event.data.brand_id}`)}>
                                {`Brand: ${event.data.brand_name}`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EventViewRelated business_ids={[event.data.venue_id, event.data.brand_id]} event_id={event.data.event_id} />
        </EventViewStyles>
    )
}

export default EventView