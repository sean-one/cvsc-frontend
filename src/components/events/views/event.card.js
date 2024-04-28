import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { decode } from 'he';
import { formatTime } from '../../../helpers/formatTime';
import { image_link } from '../../../helpers/dataCleanUp';

const EventCardStyles = styled.div`
    .eventCardWrapper {
        width: 100%;
        max-width: var(--max-section-width);
        background-size: cover;
        background-position: center;
        aspect-ratio: 1 / 1;
        margin: 0 auto 1.5rem auto;
        cursor: pointer;

        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid var(--text-color);
        border-radius: 8px;
        overflow: hidden;
    }

    .eventCardOverlay {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(0,0,0,0.7) 100%);
    }
    
    .eventCardTopRow, .eventCardBottomRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }

    .eventCardBottomRow {
        width: 100%;
        height: 9rem;
        justify-content: flex-start;
        color: var(--main-highlight-color);
        background-color: var(--main-color);
        
    }

    .eventCardHostLogo {
        width: 5rem;
        padding: 0.25rem;
        border-radius: 50%;
        margin-right: 1rem;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(255, 255, 255, 0.7);

        img {
            border-radius: 50%;
            max-width: 100%;
        }
    }

    .eventCardDateContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 0.1rem solid var(--text-color);
        padding: 0.5rem;
        border-radius: 1.5rem;
        color: var(--text-color);
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

    .eventCardDate, .eventCardMonth {
        font-size: 1.8rem;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    }

    .eventCardDetails {
        font-weight: bold;
        font-family: var(--header-font);
        width: 100%;
        display: flex;
        flex-direction: column;
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

    const backgroundImageUrl = image_link(event?.eventmedia);
    
    return (
        <EventCardStyles bgImage={backgroundImageUrl}>
            <div className="eventCardWrapper" style={{ backgroundImage: `url(${backgroundImageUrl})`}} onClick={(e) => event?.active_event ? navigate(`/event/${event?.event_id}`) : null}>
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
                            <div className='smallHeaderText'>{decode(event?.eventname)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </EventCardStyles>
    );
};

export default EventCard;
