import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { decode } from 'he';
import { formatTime } from '../../../helpers/formatTime';

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
        justify-content: flex-end;
        align-items: center;
        padding: 1rem;
    }

    .eventCardBottomRow {
        width: 100%;
        justify-content: space-around;
        color: var(--main-highlight-color);
        background-color: var(--opacity);
        
    }

    .eventCardHostLogo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 7rem;
        border-radius: 50%;
        /* box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(255, 255, 255, 0.7); */

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
        line-height: 1.1;
        padding: 0.5rem 1rem;
        width: 100%;
    }

    .eventCardDetailsEventname {
        font-size: clamp(1.8rem, 5vw, var(--header-font-size));
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
        font-family: var(--header-font);
        color: var(--main-highlight-color);
    }

    .eventCardDetailsBusinessName {
        font-size: var(--small-font);
        color: var(--text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: normal;
    }

    .eventCardDetailsTime {
        text-align: right;
        font-weight: bold;
        color: var(--main-highlight-color);
    }
`;

const EventCard = ({ event }) => {
    let navigate = useNavigate()

    if(!event) {
        return null;
    }

    const backgroundImageUrl = `${process.env.REACT_APP_BACKEND_IMAGE_URL}${event?.eventmedia}`;

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
                            <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${event?.business_avatar}`} alt={`${decode(event?.business_name)} branding`} />
                        </div>
                        <div className='eventCardDetails'>
                            <div className='eventCardDetailsEventname'>{decode(event?.eventname)}</div>
                            <div className='eventCardDetailsBusinessName' onClick={(e) => { e.stopPropagation(); navigate(`/business/${event?.host_business}`);}}>{decode(event?.business_name)}</div>
                            <div className='eventCardDetailsTime'>{`${formatTime(event?.eventstart)} - ${formatTime(event?.eventend)}`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </EventCardStyles>
    );
};

export default EventCard;
