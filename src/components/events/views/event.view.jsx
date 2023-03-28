import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../loadingSpinner';
import { formatTime } from '../../../helpers/formatTime';
import { useEventQuery } from '../../../hooks/useEventsApi';
import { image_link } from '../../../helpers/dataCleanUp';
import RelatedEvents from '../related.events';
import BusinessLabel from '../../business/business_label';

const EventViewStyles = styled.div`
    .eventViewWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 1080px;
        margin: 0 auto;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px #0D2B12;
        border-radius: 5px;
        background-color: rgba(75,111,81,0.3);
        
        @media (min-width: 768px) {
            padding: 1.5rem;
        }}

    .eventHeader {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;}
    
    .eventAddress {
        align-self: flex-start;
    }

    .eventViewDateWrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0;
        font-weight: bold;
        font-style: italic;}
    
    .eventViewDetails {
        width: 100%;
        display: flex;
        flex-direction: column;

        @media (min-width: 768px) {
            flex-direction: row;
        }
    }
    
    .eventImage {
        width: 100%;
        /* max-width: 350px; */
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.75rem 0;

        @media (min-width: 768px) {
            margin: 0.5rem;
            width: 40%;
        }

        img {
            width: 100%;
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;

            @media (min-width: 768px) {
                width: 300px;
            }
        }}
    
    .linksAndInfo {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-top: 0.5rem;

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

        > div {
            width: 100%;
            border-bottom: 1px solid white;
            border-radius: 5px;
            
            @media (min-width: 450px) {
                padding: 0.5rem 0;
                border-bottom: none;
            }
        }
        
        @media (min-width: 450px) {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;

        }
    }
`;


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
        brand_role = auth.roles.find(role => role.business_id === event.data.brand_id) || {}
        venue_role = auth.roles.find(role => role.business_id === event.data.venue_id) || {}
    }


    return (
        <EventViewStyles>
            <div className='eventViewWrapper'>

                <div className='eventHeader'>
                    <h2>{event.data.eventname.toUpperCase()}</h2>
                    {
                        (auth?.user?.id === event.data.created_by)
                            ? <div>
                                <FontAwesomeIcon icon={faPen} onClick={() => navigate(`/event/edit/${event?.data.event_id}`, { state: event?.data })}/>
                            </div>
                            : null
                    }
                </div>
                
                <div className='eventAddress'>{`${event.data.street_address}, ${event.data.location_city}`}</div>
                
                <div className='eventViewDateWrapper'>
                    <h5>{format(new Date(event.data.eventdate), 'E, MMMM d')}</h5>
                    <h5>{`${formatTime(event.data.eventstart)} - ${formatTime(event.data.eventend)}`}</h5>
                </div>

                <div className='eventViewDetails'>

                    <div className='eventImage'>
                        <img src={image_link(event.data.eventmedia)} alt={event.data.eventname} />
                    </div>

                    <div className='linksAndInfo'>
                        {/* brand and venue names and links */}
                        <div className='businessLabelLinks'>
                            <BusinessLabel business_id={event.data.venue_id} business_name={event.data.venue_name} business_role={venue_role} business_type='venue'/>
                            <BusinessLabel business_id={event.data.brand_id} business_name={event.data.brand_name} business_role={brand_role} business_type='brand'/>
                        </div>

                        {/* <div className='fs-6 lh-sm mt-1 pt-2 border-top'> */}
                        <div>
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