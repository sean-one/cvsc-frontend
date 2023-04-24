import React from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';

import { image_link } from '../../../helpers/dataCleanUp';

const EventSmallPreviewStyles = styled.div`
    .eventSmallPreviewWrapper {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        background-color: var(--page-wrapper-background-color);
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-radius: 5px;
        border: 1px solid red;
    }

    .eventSmallPreviewImage {
        width: 100%;
        max-width: 65px;
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

    .eventSmallPreviewEventname {
        flex-grow: 1;
        padding-left: 0.5rem;
    }

    .eventSmallPreviewDate {
        color: white;
    }
`;

const EventSmallPreview = ({ event }) => {
    return (
        <EventSmallPreviewStyles>
            <div className='eventSmallPreviewWrapper'>
                <div className='eventSmallPreviewImage'>
                    <img src={image_link(event.eventmedia)} alt={`${event.eventname} flyer`} />
                </div>
                <div className='eventSmallPreviewEventname'>
                    {event.eventname}
                </div>
                <div className='eventSmallPreviewDate'>
                    {format(new Date(event.eventdate), 'MMM, do')}
                </div>
            </div>
        </EventSmallPreviewStyles>
    )
}

export default EventSmallPreview;