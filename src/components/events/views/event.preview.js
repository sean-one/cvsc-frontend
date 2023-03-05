import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import styled from 'styled-components';

import { image_link } from '../../../helpers/dataCleanUp';
import BusinessLabel from '../../business/business_label';

const Styles = styled.div`
    .eventPreviewWrapper {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        margin: 1.5rem 0;
        border-top: 1px solid #0D2B12;
        border-left: 1px solid #0D2B12;
        box-shadow: 5px 5px 5px #0D2B12;
        border-radius: 5px;
    }

    .eventPreviewHeader {
        font-size: 1.25rem;
        font-weight: bold;
        letter-spacing: 0.1rem;
    }

    .eventDetailWrapper {
        display: flex;
        margin: 0.25rem 0;
    }

    .eventDateWrapper {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #dcdbc4;
        margin: 0.25rem 0;
    }
    
    .eventDetailWrapper {
        height: 10rem;
        border-bottom: 1px solid #dcdbc4;
        overflow: hidden;
    }

    .eventImage {
        width: 50%;
        padding: 0.25rem;

        img {
            width: 100%;
            border-radius: 5px;
            border: 1px solid #dcdbc4;
            display: block;
        }
    }

    .eventDetails {
        display: flex;
        flex-direction: column;
        padding-left: 0.25rem;
        width: 75%;
        font-size: 14px;
        font-weight: thin;
    }
`;

const EventPreview = ({ event }) => {
    let navigate = useNavigate()
    

    return (
        <Styles>
            <div className='eventPreviewWrapper' onClick={() => navigate(`/event/${event.event_id}`)}>

                <div className='eventPreviewHeader'>
                    <div>{event.eventname.toUpperCase()}</div>
                </div>        
                
                {/* event date information */}
                <div className='eventDateWrapper'>
                    <div>{format(new Date(event.eventdate), 'E, MMM do')}</div>
                    <div>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
                </div>
                
                {/* event image & details */}
                {/* <div className='d-flex align-items-center my-1'> */}
                <div className='eventDetailWrapper'>
                    <div className='eventImage'>
                        <img src={image_link(event.eventmedia)} />
                    </div>
                    <div className='eventDetails'>
                        <div>{event.details}</div>
                    </div>
                </div>
                <div className='d-flex'>
                    <BusinessLabel business_id={event.venue_id} business_name={event.venue_name} business_type='venue' />
                    <BusinessLabel business_id={event.brand_id} business_name={event.brand_name} business_type='brand' />
                </div>
            </div>
        </Styles>
    )
}

export default EventPreview;