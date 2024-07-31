import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import useNotification from '../../hooks/useNotification';
import { useBusinessEventsQuery } from '../../hooks/useEventsApi';
import LoadingSpinner from '../loadingSpinner';
import EventCard from './views/event.card';
import EventSmallPreview from './views/event.small.preview';
import EventSearch from './eventSearch';

const BusinessEventsRelatedStyles = styled.div`
    .businessEventsRelatedWrapper {
        display: grid; // grid container
        grid-template-columns: 1fr;
        grid-gap: 1rem;

        @media (min-width: 768px) {
            grid-template-columns: 1fr 1fr;
        }

        &.single-event {
            @media (min-width: 768px) {
                grid-template-columns: 1fr;
                justify-items: center;
            }
        }
    }

    .businessEventsRelatedHeader {
        width: 100%;
        padding: 0 1.125rem;
        margin: 1.5rem 0 0;
        color: var(--main-highlight-color);
        
        @media (min-width: 768px) {
            grid-column: 1/3;

        }
    }
`;

const BusinessEventsRelated = ({ business_id }) => {
    const { dispatch } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: events_list, isPending, isError, error: events_list_error } = useBusinessEventsQuery(business_id);
    let location = useLocation();

    if (isError) {
        // 400 - type 'business_id', 'server'
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: events_list_error?.response?.data?.error?.message
            }
        })
    }

    const business_events_list = events_list?.data.filter(event =>
        event?.eventname.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
        event?.event_creator.toLowerCase().includes(searchQuery.toLocaleLowerCase())
    ) || []

    
    return (
        <BusinessEventsRelatedStyles>
            {
                (events_list?.data.length !== 0) &&
                    <div className='businessEventsRelatedHeader'>
                        <EventSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                    </div>
            }
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) :
                    (business_events_list.length !== 0)
                        ? <div className={`businessEventsRelatedWrapper ${business_events_list.length === 1 ? 'single-event' : ''}`}>
                            {
                                business_events_list.map(event => {
                                    if (location.pathname.includes('admin')) {
                                        return (
                                            <EventSmallPreview key={event.event_id} event={event} />
                                        )
                                    } else {
                                        return (
                                            <EventCard key={event.event_id} event={event} />
                                        )
                                    }
                                })
                            }
                        </div>
                        : <div>
                            {
                                (events_list?.data.length === 0)
                                    ? null
                                    : <div>No matching results</div>
                            }
                        </div>
            }
        </BusinessEventsRelatedStyles>
    )
}

export default BusinessEventsRelated;