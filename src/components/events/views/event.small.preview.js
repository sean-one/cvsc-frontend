import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import styled from 'styled-components';

import { image_link } from '../../../helpers/dataCleanUp';
import BusinessLabel from '../../business/business.label';

const EventSmallPreviewStyles = styled.div`
    .eventSmallPreviewWrapper {
        width: 100%;
        /* max-width: 750px; */
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        background-color: var(--page-wrapper-background-color);
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-radius: 5px;
        border: 1px solid blue;
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
        padding: 0.25rem 0.5rem;
        background-color: var(--background-color);
        border-radius: 5px;
        /* border: 1px solid yellow; */
    }

    .eventSmallPreviewImage {
        width: 100%;
        max-width: 85px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 100%;
            border: 1px solid var(--image-border-color);
            display: block;
            box-shadow: 5px 5px 5px var(--image-box-shadow-color);
        }
    }

    .eventSmallPreviewDetails {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .eventSmallPreviewDetailsRow {
        width: 100%;
        display: flex;
        justify-content: space-between;
        /* border: 1px solid blue; */
    }

    .eventSmallPreviewEventname {
        margin-bottom: 0.25rem;
    }

    .eventSmallPreviewDate {
        padding-bottom: 0.25rem;
        color: white;
    }

    .eventSmallPreviewLabels {
        border: 1px solid yellow;
        justify-content: flex-end;
        flex-wrap: wrap;
    }

    .eventSmallPreviewLabel {
        flex-grow: 1;
    }
`;

const EventSmallPreview = ({ event }) => {
    let navigate = useNavigate()


    return (
        <EventSmallPreviewStyles>
            <div className='eventSmallPreviewWrapper' onClick={() => navigate(`/event/${event.event_id}`)}>
                <div className='eventSmallPreviewLeftSection'>
                    <div className='eventSmallPreviewDate'>
                        {format(new Date(event.eventdate), 'MMM, do')}
                    </div>
                    <div className='eventSmallPreviewImage'>
                        <img src={image_link(event.eventmedia)} alt={`${event.eventname} flyer`} />
                    </div>
                </div>
                <div className='eventSmallPreviewDetails'>
                    <div className='eventSmallPreviewDetailsRow'>
                        <h5 className='eventSmallPreviewEventname'>{event.eventname}</h5>
                    </div>
                    <div className='eventSmallPreviewDetailsRow eventSmallPreviewLabels'>
                        <div className='eventSmallPreviewLabel'>
                            <BusinessLabel business_id={event.venue_id} size='35' reverse />
                        </div>
                        <div className='eventSmallPreviewLabel'>
                            <BusinessLabel business_id={event.brand_id} size='35' reverse />
                        </div>
                    </div>
                </div>
            </div>
        </EventSmallPreviewStyles>
    )
}

export default EventSmallPreview;