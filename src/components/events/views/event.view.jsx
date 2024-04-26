import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns'
import { decode } from 'he';
import styled from 'styled-components';
import { GoPencil } from 'react-icons/go';

import LoadingSpinner from '../../loadingSpinner';
import EventViewRelated from '../event.view.related';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { formatTime } from '../../../helpers/formatTime';
import { image_link } from '../../../helpers/dataCleanUp';
import { useEventQuery } from '../../../hooks/useEventsApi';


const EventViewStyles = styled.div`
    .eventViewWrapper {
        width: 100%;
        height: 100%;
        padding-bottom: 2rem;
        display: grid; /* grid container */
        grid-template-areas:
        'eventdetails'
        'eventmedia'
        'eventdescription'
        ;
        background-color: var(--opacity);
        border-radius: 0.5rem;
        
        @media (min-width: 768px) {
            padding: 2.5rem 2rem;
            grid-gap: 2rem;
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
            'eventmedia eventdetails'
            'eventmedia eventdescription'
            ;
            box-shadow: inset -0.3rem -0.3rem 1rem rgba(255,255,255,0.2), 0.3rem 0.3rem 1rem rgba(0,0,0,0.3);
        }
    }

    .eventViewDetails {
        grid-area: eventdetails;
        width: 100%;
        padding: 0rem 0.75rem;
        
        @media (min-width: 768px) {
            align-self: end;
            padding-bottom: 0.75rem;
            border-bottom: 0.05rem solid var(--main-color);
        }
    }

    .eventViewDetailsTop {
        display: grid;
        grid-template-areas: 'eventhost eventname editevent';
        grid-template-columns: 8rem 1fr 3.5rem;
        align-items: center;
        color: var(--main-highlight-color);
    }

    .eventViewDetailsTop.notCreator {
        grid-template-areas: 'eventhost eventname';
        grid-template-columns: 8rem 1fr;
    }

    .eventBusinessAvatar {
        grid-area: eventhost;
        max-width: 7rem;
        padding: 0.25rem;
        margin: 0.5rem 0;
        border-radius: 50%;
        box-shadow: inset -4px -4px 5px rgba(255,255,255,0.3), 4px 4px 5px rgba(0,0,0,0.3);
        
        img {
            width: 100%;
            display: block;
            border-radius: 50%;
        }
    }
    
    .eventViewAddress {
        margin: 0.2rem 0;
        align-self: flex-start;
    }

    .dateAndTime {
        margin: 0.5rem 0 0.25rem;
        color: var(--main-highlight-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        /* border: 0.1rem solid red; */
    }

    .eventViewImage {
        grid-area: eventmedia;
        width: 100%;
    }
    
    .eventViewDescription {
        grid-area: eventdescription;
        padding: 0 0.75rem;
    }


    .eventViewEventInactive {
        color: var(--error-color);
    }
    
    .eventViewEditButton {
        flex-shrink: 0;
    }
`;


const EventView = () => {
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    let { event_id } = useParams()

    let navigate = useNavigate()
    
    const { data: event, isPending, isError, error: event_error } = useEventQuery(event_id)

    if (isError) {
        // 400 - type: 'event_id', 404 - type: 'server'
        dispatch({
            type: "ADD_NOTIFICATION", 
            payload: {
                notification_type: 'ERROR',
                message: event_error?.response?.data?.error?.message
            }
        })

        return navigate('/');
    };

    if (isPending) {
        return <LoadingSpinner />
    };

    const isCreator = () => auth?.user?.id === event?.data.created_by
    

    return (
        <EventViewStyles>
            <div className='eventViewWrapper'>
                <div className='eventViewDetails'>
                        <div className={`eventViewDetailsTop ${!isCreator() ? 'notCreator' : ''}`}>
                            <div className='eventBusinessAvatar' onClick={() => navigate(`/business/${event?.data.host_business}`)} >
                                <img src={image_link(event?.data.business_avatar)} alt='featured business branding' />
                            </div>
                            <div className='headerText' style={{ gridArea: 'eventname' }}>{decode(event?.data.eventname)}</div>
                            {
                                (isCreator()) &&
                                    <div style={{ gridArea: 'editevent', justifySelf: 'flex-end' }} onClick={() => navigate(`/event/edit/${event?.data.event_id}`)}>
                                        <GoPencil className='siteIcons' />
                                    </div>
                            }
                        </div>
                        <div className='eventViewAddress'>{event?.data?.formatted_address.replace(/, [A-Z]{2} \d{5}/, '')}</div>
                        <div className='dateAndTime'>
                            <div className='subheaderText'>{format(new Date(event?.data.eventdate), "E, MMMM d")}</div>
                            <div className='subheaderText'>{`${formatTime(event?.data.eventstart)} - ${formatTime(event?.data.eventend)}`}</div>
                        </div>
                </div>
                
                <div className='eventViewImage'>
                    <div className='imagePreview eventImage'>
                        <img src={image_link(event?.data.eventmedia)} alt={event?.data.eventname} />
                    </div>
                </div>
                
                <div className='eventViewDescription'>
                    <div>{decode(event?.data.details)}</div>
                </div>
            </div>
            {
                (event?.data?.active_event) &&
                    <EventViewRelated event={event?.data} event_id={event?.data?.event_id} />
            }
        </EventViewStyles>
    )
}

export default EventView