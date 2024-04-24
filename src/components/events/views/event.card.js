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
    }

    .eventCardOverlay {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .eventCardTopRow, .eventCardBottomRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }

    .eventCardBottomRow {
        width: 100%;
        justify-content: flex-start;
        color: var(--main-highlight-color);
        background-color: var(--main-color);
    }

    .eventCardHostLogo {
        width: 5rem;
        padding: 0.25rem;
        border-radius: 50%;
        margin-right: 1rem;
        background-color: var(--main-highlight-color);

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
                {/* <img className='eventCardBackground' src={image_link(event?.eventmedia)} alt={`${event?.eventname} event flyer`} /> */}
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
