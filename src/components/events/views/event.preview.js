import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import { image_link } from '../../../helpers/dataCleanUp';
import BusinessLabel from '../../business/business_label';

const Styles = styled.div`
    .eventPreviewWrapper {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        margin: 1.5rem 0;
        /* border-top: 1px solid #0D2B12; */
        /* border-left: 1px solid #0D2B12; */
        box-shadow: 5px 5px 5px #0D2B12;
        border-radius: 5px;
        /* background-color: rgba(164,22,35,0.6); */
        /* background-color: #a41623 */
        background-color: rgba(75,111,81,0.3);
        /* background-color: #4B6F51; */
    }

    .inactiveEvent {
        border: 5px solid rgba(164,22,35,0.6);
        /* background-color: rgba(164,22,35,0.6) */
    }

    .eventPreviewHeader {
        font-size: 1.25rem;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        letter-spacing: 0.1rem;
    }

    .eventDetailWrapper {
        display: flex;
        margin: 0.25rem 0;
    }

    .eventDateWrapper {
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0;
    }
    
    .eventDetailWrapper {
        padding: 0.5rem 0;
        border-top: 1px solid #dcdbc4;
        border-bottom: 1px solid #dcdbc4;
    }

    .eventImage {
        width: 50%;
        max-width: 150px;
        height: 100%;
        padding: 0.25rem;

        img {
            width: 100%;
            height: auto;
            /* max-height: 10rem; */
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
        max-height: 8rem;
        font-size: 14px;
        font-weight: thin;
        overflow: hidden;
    }
`;

const EventPreview = ({ event }) => {
    let navigate = useNavigate()
    

    return (
        <Styles>
            <div className={`eventPreviewWrapper ${(event.active_event) ? '' : 'inactiveEvent'}`} onClick={(event.active_event) ? () => navigate(`/event/${event.event_id}`) : null}>

                <div className='eventPreviewHeader'>
                    <div>{event.eventname.toUpperCase()}</div>
                    {
                        (!event.active_event) &&
                            <FontAwesomeIcon icon={faPencilAlt} onClick={() => navigate(`/event/edit/${event.event_id}`, { state: event })}/>
                    }
                </div>        
                
                {/* event date information */}
                <div className='eventDateWrapper'>
                    <div>{format(new Date(event.eventdate), 'E, MMM do')}</div>
                    <div>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
                </div>
                
                {/* event image & details */}
                <div className='eventDetailWrapper'>
                    <div className='eventImage'>
                        <img src={image_link(event.eventmedia)} alt={event.eventname}/>
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