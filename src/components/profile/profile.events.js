import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import { useUserEventsQuery } from '../../hooks/useEventsApi';

import LoadingSpinner from '../loadingSpinner';
import EventSmallPreview from '../events/views/event.small.preview';

const ProfileEventsStyles = styled.div`
    .profileEventsNoEvents {
        text-align: center;
    }

    .profileEventsNoneHeader {
        padding: 0.5rem 0;
    }
`;

const ProfileEvents = () => {
    const { auth, logout_user } = useAuth()

    const { data: profileEvents, isLoading, isSuccess, isError, error } = useUserEventsQuery(auth.user.id)
    
    let navigate = useNavigate()
    let events_list = []

    if(isLoading) { return <LoadingSpinner /> }

    if(isSuccess) {
        events_list = profileEvents.data
    }

    if(isError) {
        if((error.response.status === 400) || (error.response.status === 401)) {
            logout_user()
            navigate('/login')
            return false
        } else {
            navigate('/')
            return false
        }
    }

    return (
        <ProfileEventsStyles>
            <div>
                {
                    (events_list.length > 0)
                        ? events_list.map(event => {
                            return (
                                <EventSmallPreview key={event.event_id} event={event} />
                            )
                        })
                        : <div className='profileEventsNoEvents'>
                            <div className='profileEventsNoneHeader'>You currently have no created events</div>
                            <button onClick={() => navigate('/event/create')}>create a new event</button>
                        </div>
                }
            </div>
        </ProfileEventsStyles>
    )
}

export default ProfileEvents;