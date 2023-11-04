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

    .eventViewEventInactive {
        color: var(--error-color);
    }
    
    .eventViewEditButton {
        flex-shrink: 0;
    }
    
    .eventViewAddress {
        align-self: flex-start;
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
        text-align: justify;
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
        margin: 0.5rem 0;
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
                    <div className='sectionRowSplit'>
                        <div className={`headerText ${event?.data?.active_event ? '' : 'eventViewEventInactive'}`}>{event.data.eventname}</div>
                        {
                            (isCreator()) &&
                                <div onClick={() => navigate(`/event/edit/${event?.data.event_id}`, { state: event?.data })}>
                                    <EditIcon />
                                </div>
                        }
                    </div>
                    {
                        (event?.data?.active_event) &&
                            <div className='eventViewAddress'>{event.data?.venue_location.split(/\s\d{5},\sUSA/)[0]}</div>
                    }
                    {
                        (event?.data?.active_event) &&
                            <div className='sectionRowSplit'>
                                <div className='subheaderText'>{format(new Date(event.data.eventdate), 'E, MMMM d')}</div>
                                <div className='subheaderText'>{`${formatTime(event.data.eventstart)} - ${formatTime(event.data.eventend)}`}</div>
                            </div>
                    }
                </div>
                <div className='eventViewBody'>
                    <div className='eventViewImageContainer'>
                        <img className='eventViewImage' src={image_link(event.data.eventmedia)} alt={event.data.eventname} />
                    </div>
                    <div className='eventViewDetails'>
                        <div>{event.data.details}</div>
                        <div>
                            {
                                (event?.data?.active_event) &&
                                    <div className='eventViewBusiness'>
                                        <BusinessLabel
                                            businessId={event.data.venue_id}
                                            eventCreator={event?.data?.created_by}
                                            eventId={event?.data?.event_id}
                                            business_logo={event?.data?.venue_logo}
                                            business_name={event?.data?.venue_name}
                                            />
                                        <BusinessLabel
                                            businessId={event.data.brand_id}
                                            eventCreator={event?.data?.created_by}
                                            eventId={event?.data?.event_id}
                                            business_logo={event?.data?.brand_logo}
                                            business_name={event?.data?.brand_name}
                                        />
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {
                (event?.data?.active_event) &&
                    <EventViewRelated business_ids={[event.data.venue_id, event.data.brand_id]} event_id={event.data.event_id} />
            }
        </EventViewStyles>
    )
}

export default EventView