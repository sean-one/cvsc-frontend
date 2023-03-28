import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import { image_link } from '../../../helpers/dataCleanUp';
import BusinessLabel from '../../business/business_label';

const EventPreviewStyles = styled.div`
    .eventPreviewWrapper {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        margin: 1.5rem 0;
        box-shadow: 
            -3px -2px 1px 0 rgba(218, 215, 205, 0.2),
            3px 2px 1px 0 #0D2B12;
        border-radius: 5px;
        background-color: rgba(75,111,81,0.3);
    }

    .inactiveEvent {
        border: 5px solid rgba(164,22,35,0.6);
        /* background-color: rgba(164,22,35,0.6) */
    }

    .eventPreviewHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
        display: flex;
        flex-direction: column;
        padding: 0.5rem 0;
        border-top: 1px solid #dcdbc4;
        border-bottom: 1px solid #dcdbc4;
        
        @media (min-width: 550px) {
            flex-direction: row;
            justify-content: space-between;
            padding: 0.5rem 2.5rem;
        }
    }

    .eventImage {
        width: 100%;
        /* max-width: 250px; */
        height: auto;
        padding: 0.25rem;

        @media (min-width: 550px) {
            width: 50%;
            max-width: 250px;
        }

        img {
            width: 100%;
            height: auto;
            /* max-height: 10rem; */
            border-radius: 5px;
            border: 1px solid #dcdbc4;
            display: block;

            @media (min-width: 550px){
                
            }
        }
    }

    .eventDetails {
        display: flex;
        flex-direction: column;
        padding-left: 0.25rem;
        width: 100%;
        max-height: 8rem;
        font-size: 14px;
        font-weight: thin;
        overflow: hidden;

        @media (min-width: 550px) {
            width: 75%;
        }
    }

    .businessLabelWrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        @media (min-width: 360px) {
            flex-direction: row;
            justify-content: space-between;

        }
    }
`;

const EventPreview = ({ event }) => {
    let navigate = useNavigate()
    

    return (
        <EventPreviewStyles>
            <div className={`eventPreviewWrapper ${(event.active_event) ? '' : 'inactiveEvent'}`}>

                <div className='eventPreviewHeader'>
                    <h2 onClick={(event.active_event) ? () => navigate(`/event/${event.event_id}`) : null}>{event.eventname.toUpperCase()}</h2>
                    {
                        (!event.active_event) &&
                            <FontAwesomeIcon icon={faPencilAlt} onClick={() => navigate(`/event/edit/${event.event_id}`, { state: event })}/>
                    }
                </div>        
                
                {/* event date information */}
                <div className='eventDateWrapper'>
                    <h5>{format(new Date(event.eventdate), 'E, MMM do')}</h5>
                    <h5>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</h5>
                </div>
                
                {/* event image & details */}
                <div className='eventDetailWrapper' onClick={(event.active_event) ? () => navigate(`/event/${event.event_id}`) : null}>

                    <div className='eventImage'>
                        <img
                            src={image_link(event.eventmedia)}
                            alt={event.eventname}
                        />
                    </div>
                    <div className='eventDetails'>
                        <div>{event.details}</div>
                    </div>
                </div>

                {
                    (event.active_event)
                        ? <div className='businessLabelWrapper'>
                            <BusinessLabel business_id={event.venue_id} event_id={event.event_id} business_type='venue' />
                            <BusinessLabel business_id={event.brand_id} event_id={event.event_id} business_type='brand' />
                        </div>
                        : null
                }
            </div>
        </EventPreviewStyles>
    )
}

export default EventPreview;