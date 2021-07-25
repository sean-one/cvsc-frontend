import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../helpers/axios';

import EventPreview from '../events/eventPreview';

import UserContext from '../../context/userContext';

import './profile.css';

const Profile = (props) => {
    const { userProfile, setUserProfile, userEvents, setUserEvents } = useContext(UserContext);
    const [ refresher, setRefresher ] = useState(false);

    const removeEvent = async (e) => {
        const token = localStorage.getItem('token')
        AxiosInstance.delete(`/events/remove/${e.currentTarget.id}`, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
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
            setUserProfile(JSON.parse(userData));
        }
        async function getData() {
            const events = await AxiosInstance.get(`events/user/${userData.id || parseInt(localStorage.getItem('userId'))}`)
            setUserEvents(events.data)
            return
        }
        getData()
    }, [refresher, setUserProfile, setUserEvents]);

    return (
        <div className='userProfile'>
            <div className='account'>
                <img src={userProfile.avatar || 'https://picsum.photos/100/100'} alt='account avatar' />
                <h1>{`Welcome ${userProfile.username}`}</h1>
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
                                    <div><FontAwesomeIcon icon={faPencilAlt} size='1x' /></div>
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

export default Profile;