import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useEventsQuery } from '../../../hooks/useEventsApi';
import EventSmallPreview from '../../events/views/event.small.preview';
import LoadingSpinner from '../../loadingSpinner';

const ModEventsStyles = styled.div`
    .modEventsWrapper {
        padding: 2rem 1rem;
        margin: 0 auto;
        max-width: var(--max-section-width);
        /* background: var(--opacity); */
    }
    
    .modEventsHeader {
        display: flex;
        align-items: center;
        justify-content: space-around;

        div {
            text-align: center;
            flex-grow: 1;
        }

        img {
            cursor: pointer;
            max-width: 5rem;
        }
    }
`;

const ModEvents = () => {
    const { data: events_list, isPending, isError } = useEventsQuery();
    let navigate = useNavigate();


    return (
        <ModEventsStyles>
            <div className='modEventsWrapper'>
                <div className='modEventsHeader'>
                    <div className='subheaderText'>Events Mod Section</div>
                    <img onClick={() => navigate('/squirrelmaster')} src={`${process.env.PUBLIC_URL}/assets/squirrel-master.webp`} alt='squirrel' />
                </div>
                {
                    isPending ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        null
                    ) : (events_list?.data?.length !== 0) ? (
                        events_list?.data.map(event => {
                            return (
                                <EventSmallPreview key={event.id} event={event} />
                            )
                        })
                    ) : (
                        <div>nothing to show</div>
                    )
                }
            </div>
        </ModEventsStyles>
    )
}

export default ModEvents;