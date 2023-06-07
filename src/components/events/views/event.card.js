import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import { image_link } from '../../../helpers/dataCleanUp';

import BusinessLabel from '../../business/business.label';

const EventCardStyles = styled.div`
    .eventCardWrapper {
        position: relative;
        width: 100%;
        border-radius: 5px;
        margin-bottom: 1.25rem;
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

    .eventCardRow {
        color: var(--background-color);
        width: 100%;
        padding: 0.75rem;
    }    

    .eventCardTopRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .eventCardBottomRow {
        border-radius: 5px;
        background-color: rgba(218,215,205,0.8);
    }

    .eventCardDateContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid black;
        padding: 0.7rem;
        border-radius: 5px;
        background-color: var(--main-text-color);
        line-height: 1;
        font-weight: bold;
    }

    .eventCardDate {
        font-size: 1.8rem;
    }

    .eventCardMonth {
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .eventCardTime {

    }

    .eventCardEventname {
        line-height: 1;
        font-size: 1.4rem;
        font-weight: bold;
        text-transform: uppercase;
    }

    .eventCardVenueRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

const EventCard = ({ event }) => {
    let navigate = useNavigate()


    return (
        <EventCardStyles>
            <div className="eventCardWrapper" onClick={(event.active_event) ? () => navigate(`/event/${event.event_id}`) : null}>
                <img className='eventCardBackground' src={image_link(event.eventmedia)} alt={`${event.eventname} event flyer`} />
                <div className="eventCardOverlay">
                    <div className='eventCardRow eventCardTopRow'>
                        <BusinessLabel businessId={event.brand_id} imageOnly={true}/>
                        <div className='eventCardDateContainer'>
                            <div className='eventCardDate'>{format(new Date(event.eventdate), 'dd')}</div>
                            <div className='eventCardMonth'>{format(new Date(event.eventdate), 'MMM')}</div>
                        </div>
                    </div>
                    <div className='eventCardRow eventCardBottomRow'>
                        <div className='eventCardTime'>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
                        <div className='eventCardEventname'>{event.eventname}</div>
                        <div className='eventCardVenueRow'>
                            <div>{event.venue_name}</div>
                            <BusinessLabel businessId={event.venue_id} imageOnly={true} />
                        </div>
                    </div>
                </div>
            </div>
        </EventCardStyles>
    );
};

export default EventCard;
