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
        'eventheader'
        'eventmedia'
        'eventdetails'
        ;
        background-color: var(--opacity);
        border-radius: 0.5rem;
        
        @media (min-width: 768px) {
            padding: 2.5rem 2rem;
            grid-gap: 2rem;
            grid-template-areas:
            'eventmedia eventheader'
            'eventmedia eventdetails'
            ;
        }
    }

    .eventViewHeader {
        grid-area: eventheader;
        align-self: end;
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0rem 0.75rem 1rem;
        
        @media (min-width: 768px) {
            border-bottom: 0.05rem solid var(--main-color);
        }
    }

    .titleAndEditIcon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--main-highlight-color);
    }

    .eventViewBusinessAvatarAndEventTitle {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .eventBusinessAvatar {
        max-width: 5rem;
        margin: 0.5rem 0;
        border-radius: 50%;
        box-shadow: inset 3px 3px 5px var(--main-background-color), 3px 3px 5px var(--main-highlight-color);
        
        img {
            width: 100%;
            display: block;
            border-radius: 50%;
        }
    }
    
    .eventViewAddress {
        align-self: flex-start;
    }

    .dateAndTime {
        color: var(--main-highlight-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .eventViewImage {
        grid-area: eventmedia;
    }
    
    .eventViewDetails {
        grid-area: eventdetails;
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
                <div className='eventViewHeader'>
                        <div className='titleAndEditIcon'>
                            <div className='eventViewBusinessAvatarAndEventTitle'>
                                <div className='eventBusinessAvatar' onClick={() => navigate(`/business/${event?.data.host_business}`)} >
                                    <img src={image_link(event?.data.business_avatar)} alt='featured business branding' />
                                </div>
                                <div className={`headerText ${event?.data?.active_event ? '' : 'eventViewEventInactive'}`}>{decode(event?.data.eventname)}</div>
                            </div>
                            {
                                (isCreator()) &&
                                    <div onClick={() => navigate(`/event/edit/${event?.data.event_id}`)}>
                                        <GoPencil className='siteIcons' />
                                    </div>
                            }
                        </div>
                        {
                            (event?.data?.active_event) &&
                                <div className='eventViewAddress'>{event?.data?.formatted_address.replace(/, [A-Z]{2} \d{5}/, '')}</div>
                        }
                        {
                            (event?.data?.active_event) &&
                                <div className='dateAndTime'>
                                    <div className='subheaderText'>{format(new Date(event?.data.eventdate), "E, MMMM d")}</div>
                                    <div className='subheaderText'>{`${formatTime(event?.data.eventstart)} - ${formatTime(event?.data.eventend)}`}</div>
                                </div>
                        }
                </div>
                <div className='eventViewImage'>
                    <div className='imagePreview eventImage'>
                        <img src={image_link(event?.data.eventmedia)} alt={event?.data.eventname} />
                    </div>
                </div>
                <div className='eventViewDetails'>
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