import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns'
import styled from 'styled-components';

import { EditIcon } from '../../icons/siteIcons';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../loadingSpinner';
import { formatTime } from '../../../helpers/formatTime';
import { useEventQuery } from '../../../hooks/useEventsApi';
import { image_link } from '../../../helpers/dataCleanUp';
import RelatedEvents from '../related.events';
import BusinessLabel from '../../business/business.label';

const EventViewStyles = styled.div`
    .eventViewWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 1080px;
        margin: 0 auto;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-radius: 5px;
        background-color: var(--page-wrapper-background-color);
        
        @media (min-width: 768px) {
            padding: 1.5rem;
        }}

    .eventViewRow {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;}

    .eventViewEventname {
        flex-grow: 1;}

    .eventViewEditButton {
        flex-shrink: 0;}
    
    .eventViewAddress {
        align-self: flex-start;
    }

    .eventViewDateWrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0;
        font-weight: bold;
        font-style: italic;}
    
    .eventViewDetailsRow {
        width: 100%;
        display: flex;
        flex-direction: column;

        @media (min-width: 768px) {
            flex-direction: row;
        }
    }
    
    .eventViewImage {
        width: 100%;
        max-width: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.75rem auto;

        @media (min-width: 768px) {
            margin: 0.5rem;
        }

        img {
            width: 100%;
            border: 1px solid var(--image-border-color);
            display: block;
            box-shadow: 5px 5px 5px var(--image-box-shadow-color);

        }}
    
    .linksAndInfo {
        align-self: center;
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-top: 0.5rem;
        flex-grow: 1;

        @media (min-width: 768px) {
            padding-top: 0;
            padding-left: 1rem;
        }
    }

    .businessLabelLinks {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 0.5rem;
        
        > div {
            width: 100%;
            border-bottom: 1px solid white;
            padding-bottom: 0.5rem;
            margin: 0.25rem 0;
            border-radius: 5px;
        }
        
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

                <div className='eventViewRow'>
                    
                    <div className='eventViewEventname'>
                        <h2>{event.data.eventname.toUpperCase()}</h2>
                    </div>

                    {
                        (auth?.user?.id === event.data.created_by)
                            ? <div onClick={() => navigate(`/event/edit/${event?.data.event_id}`, { state: event?.data })} className='eventViewEditButton'>
                                <EditIcon />
                            </div>
                            : null
                    }
                </div>
                
                <div className='eventViewAddress'>{`${event.data.street_address}, ${event.data.location_city}`}</div>
                
                <div className='eventViewDateWrapper'>
                    <h5>{format(new Date(event.data.eventdate), 'E, MMMM d')}</h5>
                    <h5>{`${formatTime(event.data.eventstart)} - ${formatTime(event.data.eventend)}`}</h5>
                </div>

                <div className='eventViewDetailsRow'>

                    <div className='eventViewImage'>
                        <img src={image_link(event.data.eventmedia)} alt={event.data.eventname} />
                    </div>

                    <div className='linksAndInfo'>

                        <div className='businessLabelLinks'>
                            <BusinessLabel business_id={event.data.venue_id} />
                            <BusinessLabel business_id={event.data.brand_id} reverse={true} />
                        </div>

                        <div className='eventViewDetails'>
                            {event.data.details}
                        </div>

                    </div>
                </div>
            </div>
            <div>
                <RelatedEvents business_ids={[event.data.venue_id, event.data.brand_id]} event_id={event.data.event_id} />
            </div>
        </EventViewStyles>
    )
}

export default EventView