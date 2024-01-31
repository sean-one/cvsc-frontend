import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { formatTime } from '../../../helpers/formatTime';
import styled from 'styled-components';

import { image_link } from '../../../helpers/dataCleanUp';
import { SmallEditIcon, SmallUserIcon } from '../../icons/siteIcons';

import useAuth from '../../../hooks/useAuth';

const EventSmallPreviewStyles = styled.div`
    .eventSmallPreviewWrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        gap: 10px;
    }

    .eventSmallPreviewInactive {
        margin: 0.5rem;
        padding: 0.5rem;
        border-radius: 5px;
        color: var(--error-color);
        border: 1px solid var(--error-color);
    }

    .eventSmallPreviewAdminControls {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        cursor: pointer;
        display: flex;
    }

    .eventSmallPreviewLeftSection {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 5px;
    }

    .eventSmallPreviewImageContainer {
        width: 7rem;
        height: 7rem;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
    }
    
    .eventSmallPreviewImage {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 5px;
        border: 1px solid var(--trim-color);
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .eventSmallPreviewInfo {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .eventSmallPreviewDate {
        font-size: var(--small-font);
        line-height: calc(var(--small-font) + 0.1rem);
        font-weight: thin;
        color: #F4F6F5;
    }

    .eventSmallPreviewDetails {
        display: -webkit-box;
        font-size: var(--small-font);
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 4.8rem;
        line-height: calc(var(--small-font) + 0.1rem);
        cursor: pointer;
    }

    .eventCreator {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.2rem;
        margin-top: 1rem;
        font-size: var(--small-font);
    }
`;

const EventSmallPreview = ({ event }) => {
    const { auth, isLoggedIn } = useAuth()
    let navigate = useNavigate()
    let { pathname } = useLocation()

    // event creator will show on preview inside of business admin view
    const isBusinessAdminView = pathname.includes('/business/admin/');

    if (!event) { return null; }

    const isCreator = () => auth?.user?.id === event.created_by


    return (
        <EventSmallPreviewStyles>
            <div className={`${event?.active_event ? 'sectionContainer' : 'eventSmallPreviewInactive'} eventSmallPreviewWrapper`} onClick={() => navigate(`/event/${event.event_id}`)}>
                {
                    (isLoggedIn) &&
                        <div className='eventSmallPreviewAdminControls'>
                            {
                                (isCreator()) && <div onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/event/edit/${event.event_id}`)
                                }}><SmallEditIcon /></div>
                            }
                        </div>
                }
                <div className='eventSmallPreviewLeftSection'>
                    <div className='eventSmallPreviewImageContainer'>
                        <img className='eventSmallPreviewImage' src={image_link(event.eventmedia)} alt={`${event.eventname} flyer`} />
                    </div>
                </div>
                
                <div className='eventSmallPreviewInfo'>
                    <div className='eventSmallPreviewDate'>{`${format(new Date(event.eventdate), "MMM. dd")} | ${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
                    <div className='smallHeaderText'>{event.eventname}</div>
                    <div className='eventSmallPreviewDetails'>{event.details}</div>
                    {
                        isBusinessAdminView && <div className='eventCreator'><SmallUserIcon />{event.event_creator}</div>
                    }
                </div>
            </div>
        </EventSmallPreviewStyles>
    )
}

export default EventSmallPreview;