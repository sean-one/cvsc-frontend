import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import styled from 'styled-components';

import { image_link } from '../../../helpers/dataCleanUp';

const EventSmallPreviewStyles = styled.div`
    .eventSmallPreviewWrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 10px;

        @media (min-width: 768px) {
            padding: 1.5rem;
        }
    }

    .eventSmallPreviewLeftSection {
        min-width: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 5px;
    }

    .eventSmallPreviewImageContainer {
        width: 100%;
        max-width: 10rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .eventSmallPreviewImage {
        width: 100%;
        border: 1px solid var(--image-border-color);
        display: block;
        box-shadow: 5px 5px 5px var(--image-box-shadow-color);
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

const EventSmallPreview = ({ event }) => {
    let navigate = useNavigate()


    return (
        <EventSmallPreviewStyles>
            <div className='sectionContainer eventSmallPreviewWrapper' onClick={() => navigate(`/event/${event.event_id}`)}>
                
                <div className='eventSmallPreviewLeftSection'>
                    <div className='eventSmallPreviewImageContainer'>
                        <img className='eventSmallPreviewImage' src={image_link(event.eventmedia)} alt={`${event.eventname} flyer`} />
                    </div>
                </div>
                
                <div className='eventSmallPreviewDetails'>
                    <div className='eventSmallPreviewDate'>{`${format(new Date(event.eventdate), 'MMM dd')} | ${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
                    <div className='eventSmallPreviewEventname'>{event.eventname}</div>
                </div>

            </div>
        </EventSmallPreviewStyles>
    )
}

export default EventSmallPreview;