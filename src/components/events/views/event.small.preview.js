import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import styled from 'styled-components';
import { decode } from 'he';
import { FaUser, FaCannabis } from 'react-icons/fa6';
import { GoPencil } from 'react-icons/go';

import { formatTime } from '../../../helpers/formatTime';

import useAuth from '../../../hooks/useAuth';

const EventSmallPreviewStyles = styled.div`
    .eventSmallPreviewWrapper {
        width: 100%;
        margin: 0 auto;
        height: 15rem;
        max-width: var(--max-section-width);
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        gap: 1rem;
        border-radius: 0.5rem;
        background: var(--opacity);
        box-shadow: 0.3rem 0.3rem 0.5rem rgba(0,0,0,0.3);
        border: 0.1rem solid var(--text-color);

    }

    .eventSmallPreviewAdminControls {
        position: absolute;
        color: var(--main-highlight-color);
        right: 0.75rem;
        top: 0.75rem;
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
        margin-left: 0.5rem;
        width: 14rem;
        height: 14rem;
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
        border-radius: 0.5rem;
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .eventSmallPreviewInfo {
        width: 100%;
        display: grid;
        grid-gap: 0.25rem;
        padding: 0.5rem 0.75rem 0.75rem 0;
    }

    .eventSmallPreviewEventname {
        color: var(--main-highlight-color);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .eventSmallPreviewDate {
        font-size: var(--small-font);
        line-height: calc(var(--small-font) + 0.15rem);
        font-weight: thin;
    }

    .eventSmallPreviewDetails {
        display: -webkit-box;
        font-size: var(--small-font);
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 7.2rem;
        line-height: calc(var(--small-font) + 0.15rem);
        cursor: pointer;
    }

    .eventCreator {
        align-self: end;
        display: -webkit-box;
        justify-content: flex-end;
        align-items: center;
        gap: 0.5rem;
        padding-top: 1rem;
        margin-top: 0.5rem;
        font-size: var(--small-font);
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: nowrap;
    }
    
    .eventCreator span {
        padding-left: 0.5rem;
    }
`;

const EventSmallPreview = ({ event }) => {
    const { auth, isLoggedIn } = useAuth()
    let navigate = useNavigate()
    let { pathname } = useLocation()

    // event creator will show on preview inside of business admin view
    const isBusinessAdminView = pathname.includes('/business/admin/');
    const isProfileEventsView = pathname.includes('/profile/events');

    if (!event) { return null; }

    const isCreator = () => auth?.user?.id === event.created_by


    return (
        <EventSmallPreviewStyles>
            <div className='eventSmallPreviewWrapper' onClick={() => navigate(`/event/${event.event_id}`)}>
                {
                    (isLoggedIn) &&
                        <div className='eventSmallPreviewAdminControls'>
                            {
                                (isCreator()) && <div onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/event/edit/${event.event_id}`)
                                }}><GoPencil className='smallSiteIcons' /></div>
                            }
                        </div>
                }
                <div className='eventSmallPreviewLeftSection'>
                    <div className='eventSmallPreviewImageContainer'>
                        <img className='eventSmallPreviewImage' src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${event.eventmedia}`} alt={`${decode(event.eventname)} flyer`} />
                    </div>
                </div>
                
                <div className='eventSmallPreviewInfo'>
                    <div className='eventSmallPreviewDate'>{`${format(new Date(event.eventdate), "MMM. dd")} | ${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</div>
                    <div className='smallHeaderText eventSmallPreviewEventname'>{decode(event.eventname)}</div>
                    <div className='eventSmallPreviewDetails'>{decode(event.details)}</div>
                    {
                        isBusinessAdminView && <div className='eventCreator'><FaUser className='smallSiteIcons' /><span style={{ color: 'var(--main-highlight-color)' }}>{decode(event.event_creator)}</span></div>
                    }
                    {
                        isProfileEventsView && <div className='eventCreator'><FaCannabis className='smallSiteIcons' /><span style={{ color: 'var(--main-highlight-color)' }}>{decode(event.business_name)}</span></div>
                    }
                </div>
            </div>
        </EventSmallPreviewStyles>
    )
}

export default EventSmallPreview;