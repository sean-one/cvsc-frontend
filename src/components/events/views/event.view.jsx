import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns'
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { EditIcon } from '../../icons/siteIcons';
import LoadingSpinner from '../../loadingSpinner';
import { formatTime } from '../../../helpers/formatTime';
import BusinessLabel from '../../business/business.label';
import { useEventQuery } from '../../../hooks/useEventsApi';
import { image_link } from '../../../helpers/dataCleanUp';
import ServerDown from '../../serverDown';
import EventViewRelated from '../event.view.related';

const EventViewStyles = styled.div`

    .eventViewWrapper {
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        width: 100%;
        
        @media (min-width: 768px) {
            padding: 0.75rem;
        }
    }

    .eventViewTopInfo {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0rem 0.5rem;
    }

    .eventViewHeaderRow {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    
    .eventViewEventname {
        flex-grow: 1;
        font-size: 1.6rem;
        line-height: 1.7rem;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .eventViewEditButton {
        flex-shrink: 0;
    }
    
    .eventViewAddress {
        align-self: flex-start;
    }
    
    .eventViewDateWrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        font-style: italic;
    }
    
    .eventViewBody {
        width: 100%;
        display: flex;
        flex-direction: column;

        @media (min-width: 768px) {
            flex-direction: row;
        }
    }
    
    .eventViewImageContainer {
        width: 100%;
        max-width: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.75rem auto;

        @media (min-width: 768px) {
            margin: 0.5rem;
        }
    }
    
    .eventViewImage {
        width: 100%;
        border: 1px solid var(--trim-color);
        display: block;
    }

    .eventViewDetails {
        align-self: center;
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 0 0.5rem;
    
        @media (min-width: 768px) {
            padding: 0 0 0 0.5rem;
        }
    }

    .eventViewBusiness {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
`;


const EventView = () => {
    const { auth } = useAuth()
    let { event_id } = useParams()

    let navigate = useNavigate()
    
    const { data: event, status } = useEventQuery(event_id)

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        return <ServerDown />
    }

    const isCreator = () => auth?.user?.id === event.data.created_by

    return (
        <EventViewStyles>
            <div className='eventViewWrapper'>
                <div className='eventViewTopInfo'>
                    <div className='eventViewHeaderRow'>
                        <div className='eventViewEventname'>{event.data.eventname}</div>
                        {
                            (isCreator()) &&
                                <div onClick={() => navigate(`/event/edit/${event?.data.event_id}`, { state: event?.data })}>
                                    <EditIcon />
                                </div>
                        }
                    </div>
                    <div className='eventViewAddress'>{event.data?.venue_location.split(/,\s[A-Z]{2}\s\d{5},\sUSA/)[0]}</div>
                    <div className='eventViewDateWrapper'>
                        <div>{format(new Date(event.data.eventdate), 'E, MMMM d')}</div>
                        <div>{`${formatTime(event.data.eventstart)} - ${formatTime(event.data.eventend)}`}</div>
                    </div>
                </div>
                <div className='eventViewBody'>
                    <div className='eventViewImageContainer'>
                        <img className='eventViewImage' src={image_link(event.data.eventmedia)} alt={event.data.eventname} />
                    </div>
                    <div className='eventViewDetails'>
                        <div>{event.data.details}</div>
                        <div>
                            <div className='eventViewBusiness'>
                                <BusinessLabel businessId={event.data.venue_id} eventCreator={event?.data?.created_by} eventId={event?.data?.event_id} />
                                <BusinessLabel businessId={event.data.brand_id} eventCreator={event?.data?.created_by} eventId={event?.data?.event_id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EventViewRelated business_ids={[event.data.venue_id, event.data.brand_id]} event_id={event.data.event_id} />
        </EventViewStyles>
    )
}

export default EventView