import React, { useState, useContext, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../helpers/axios';

import EventPreview from '../events/eventPreview';

import { UsersContext } from '../../context/users/users.provider';
import { EventsContext } from '../../context/events/events.provider';

import './profile.css';

const Profile = (props) => {
    const { userProfile, userEvents, setUserEvents, getFromLocal, deleteEvent } = useContext(UsersContext);
    const { removeFromEvents } = useContext(EventsContext)
    const [ refresher, setRefresher ] = useState(true)

    const removeEvent = async (e) => {
        const eventId = e.currentTarget.id
        const token = localStorage.getItem('token')
        AxiosInstance.delete(`/events/remove/${eventId}`, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                removeFromEvents(eventId)
                deleteEvent(eventId)
                setRefresher(!refresher)
                return
            })
            .catch(err => {
                console.log('something went wrong', err)
            })
    }

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData)
            getFromLocal(user)
        }
        async function getData() {
            const events = await AxiosInstance.get(`events/user/${parseInt(localStorage.getItem('userId'))}`)
            setUserEvents(events.data)
            return
        }
        getData()
    }, [refresher]);

    return (
        <div className='userProfile'>
            <div className='account'>
                <div className='userinfo'>
                    <h3>{userProfile.username}</h3>
                </div>
            </div>
            <div className='createNewEvent'>
                <Link to={{
                    pathname: '/events/create',
                    state: {
                        from: props.location.pathname
                    }
                }}>
                    <p>+ CREATE A NEW EVENT</p>
                </Link>
            </div>
            <div className='userEvents'>
                {
                    userEvents.map(event => {
                        return (
                            <div key={event.event_id} className='adminWrapper'>
                                <div className='adminControls'>
                                    <Link to={{
                                        pathname: `/events/edit/${event.event_id}`,
                                        state: {
                                            event,
                                            from: props.location.pathname
                                        }
                                    }}>
                                        <div><FontAwesomeIcon id={event.event_id} icon={faPencilAlt} size='1x' /></div>
                                    </Link>
                                    <div><FontAwesomeIcon id={event.event_id} icon={faTrashAlt} size='1x' onClick={removeEvent} /></div>
                                </div>
                                <EventPreview key={event.event_id} event={event} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default withRouter(Profile);