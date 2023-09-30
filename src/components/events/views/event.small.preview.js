import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import styled from 'styled-components';

import { image_link } from '../../../helpers/dataCleanUp';
import { EditIcon } from '../../icons/siteIcons';

const EventSmallPreviewStyles = styled.div`
    .eventSmallPreviewWrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        gap: 10px;
    }

    .eventSmallPreviewEdit {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        cursor: pointer;
    }

    .eventSmallPreviewLeftSection {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 5px;
    }

    .eventSmallPreviewImageContainer {
        width: 7rem;
        height: 7rem;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
    }
    
    .eventSmallPreviewImage {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 5px;
        border: 1px solid var(--trim-color);
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .eventSmallPreviewDetails {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .eventSmallPreviewEventname {
        font-size: 1.2rem;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 0.25rem;
    }
`;

const EventSmallPreview = ({ event, user=false, business=false }) => {
    let navigate = useNavigate()


    console.log(event, user, business)
    return (
        <EventSmallPreviewStyles>
            <div className='sectionContainer eventSmallPreviewWrapper' onClick={() => navigate(`/event/${event.event_id}`)}>
                {
                    user && <div className='eventSmallPreviewEdit' onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/event/edit/${event.event_id}`, { state: event })
                    }}><EditIcon /></div>
                }
                {
                    business && <div className='eventSmallPreviewEdit' onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/event/edit/${event.event_id}`, { state: event })
                    }}><EditIcon /></div>
                }
                <div className='eventSmallPreviewLeftSection'>
                    <div className='eventSmallPreviewImageContainer'>
                        <img className='eventSmallPreviewImage' src={image_link(event.eventmedia)} alt={`${event.eventname} flyer`} />
                    </div>
                </div>
                
                <div className='eventSmallPreviewDetails'>
                    <div className='eventSmallPreviewDate'>{`${format(new Date(event.eventdate), 'MMM dd')} | ${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
                    <div className='eventSmallPreviewEventname'>{event.eventname}</div>
                    <div className='truncated-text'>{event.details}</div>
                </div>

            </div>
        </EventSmallPreviewStyles>
    )
}

export default EventSmallPreview;