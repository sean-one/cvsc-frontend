import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import { image_link } from '../../../helpers/dataCleanUp';

const EventCardStyles = styled.div`
    .eventCardWrapper {
        position: relative;
        width: 100%;
        max-width: 50rem;
        margin-bottom: 1.5rem;
        overflow: hidden;

        &:before {
            content: "";
            display: block;
            padding-bottom: 100%;
        }
    }
    
    .eventCardBackground {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .eventCardOverlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
    }
    
    .eventCardTopRow {
        width: 100%;
        padding: 1.5rem 1.5rem 0 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    
    .eventCardBottomRow {
        width: 100%;
        padding: 1rem 0.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #202020;
        background-color: var(--main-color);
    }

    .eventCardHostLogo {
        width: 5rem;
        padding: 0.25rem;
        border-radius: 50%;
        margin-right: 1rem;
        background-color: #F0F0F0;

        img {
            border-radius: 50%;
            max-width: 100%;
        }
    }

    .eventCardDateContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 0.1rem solid var(--main-color);
        padding: 0.5rem;
        border-radius: 1.5rem;
        color: var(--main-color);
        background-color: var(--main-background-color);
        line-height: 1;
        font-weight: bold;
    }

    .eventCardDate {
        font-size: 1.8rem;
    }

    .eventCardMonth {
        font-size: 1.2rem;
        text-transform: uppercase;
        letter-spacing: 0.2rem;
    }

    .eventCardDetails {
        width: 100%;
    }

    .subHeaderRow {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

`;

const EventCard = ({ event }) => {
    let navigate = useNavigate()

    if(!event) {
        return null;
    }

    
    return (
        <EventCardStyles>
            <div className="eventCardWrapper" onClick={(e) => event?.active_event ? navigate(`/event/${event?.event_id}`) : null}>
                <img className='eventCardBackground' src={image_link(event?.eventmedia)} alt={`${event?.eventname} event flyer`} />
                <div className="eventCardOverlay">
                    <div className='eventCardTopRow'>
                        <div className='eventCardDateContainer'>
                            <div className='eventCardDate'>{format(new Date(event?.eventdate), "dd")}</div>
                            <div className='eventCardMonth'>{format(new Date(event?.eventdate), "MMM")}</div>
                        </div>
                    </div>
                    <div className='eventCardBottomRow'>
                        <div className='eventCardHostLogo' onClick={(e) => { e.stopPropagation(); navigate(`/business/${event?.host_business}`);}}>
                            <img src={image_link(event?.business_avatar)} alt={`${event?.business_name} branding`} />
                        </div>
                        <div className='eventCardDetails'>
                            <div className='subHeaderRow'>
                                <div onClick={(e) => { e.stopPropagation(); navigate(`/business/${event?.host_business}`);}}>{event?.business_name}</div>
                                <div>{`${formatTime(event?.eventstart)} - ${formatTime(event?.eventend)}`}</div>
                            </div>
                            <div className='smallHeaderText'>{event?.eventname}</div>
                        </div>
                    </div>
                </div>
            </div>
        </EventCardStyles>
    );
};

export default EventCard;
