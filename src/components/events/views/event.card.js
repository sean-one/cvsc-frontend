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
        max-width: var(--max-page-width);
        border-radius: 1.8rem;
        margin-bottom: 1.875rem;
        overflow: hidden;
        border: 2px solid var(--trim-color);

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

    .eventCardRow {
        width: 100%;
        padding: 0.375rem 1.125rem 1.125rem;
    }    

    .eventCardTopRow {
        margin-top: 1.5rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    
    .eventCardBottomRow {
        color: var(--black-and-white);
        border-radius: 1.5rem;
        background-color: var(--trim-color);
    }

    .eventCardDateContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid var(--black-and-white);
        padding: 1.05rem;
        border-radius: 1.8rem;
        color: var(--secondary-color);
        background-color: var(--main-color);
        line-height: 1;
        font-weight: bold;
    }

    .eventCardDate {
        font-size: var(--header-font-size);
    }

    .eventCardMonth {
        font-size: var(--main-font-size);
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .eventCardDetails {
        display: -webkit-box;
        font-size: var(--small-font);
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 7.2rem;
        cursor: pointer;
        text-align: justify;
    }

    .subHeaderRow {
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
                    <div className='eventCardRow eventCardTopRow'>
                        <div className='eventCardDateContainer'>
                            <div className='eventCardDate'>{format(new Date(event?.eventdate), "dd")}</div>
                            <div className='eventCardMonth'>{format(new Date(event?.eventdate), "MMM")}</div>
                        </div>
                    </div>
                    <div className='eventCardRow eventCardBottomRow'>
                        <div className='smallHeaderText'>{event?.eventname}</div>
                        <div className='subHeaderRow'>
                            <div onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/business/${event?.host_business}`);
                            }}>{event?.business_name}</div>
                            <div>{`${formatTime(event?.eventstart)} - ${formatTime(event?.eventend)}`}</div>
                        </div>
                        <div className='eventCardDetails'>{event?.details}</div>
                    </div>
                </div>
            </div>
        </EventCardStyles>
    );
};

export default EventCard;
