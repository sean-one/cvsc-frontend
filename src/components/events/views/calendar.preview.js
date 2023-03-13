import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import styled from 'styled-components';

import { formatTime } from '../../../helpers/formatTime';
import { image_link } from '../../../helpers/dataCleanUp';
import BusinessLabel from '../../business/business_label';

const Styles = styled.div`
    .calendarPreviewWrapper {
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

    .calendarPreviewHeader {
        font-size: 1.25rem;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        letter-spacing: 0.1rem;
        margin: 0.5rem 0;
    }

    .timeDateDetails {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.25rem 0;
    }
`;

const CalendarPreview = ({ event }) => {

    
    return (
        <Styles>
            <div className='calendarPreviewWrapper'>
                <div className='timeDateDetails'>
                    <div>{format(new Date(event.eventdate), 'E, MMM d')}</div>
                    <div>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
                </div>
                <Link to={{ pathname: `/event/${event.event_id}` }}>
                    <img src={image_link(event.eventmedia)} alt={`${event.eventname} information`} className='img-fluid w-100' />
                    <div className='calendarPreviewHeader'>
                        <div>{event.eventname.toUpperCase()}</div>
                    </div>
                </Link>
                <div className='d-flex'>
                    <BusinessLabel business_id={event.venue_id} business_name={event.venue_name} business_type='venue' />
                    <BusinessLabel business_id={event.brand_id} business_name={event.brand_name} business_type='brand' />
                </div>
            </div> 
        </Styles>
    )
}

export default CalendarPreview;