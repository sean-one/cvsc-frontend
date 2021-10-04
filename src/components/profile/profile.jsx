import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { UsersContext } from '../../context/users/users.provider';
import { EventsContext } from '../../context/events/events.provider';

import AdminSection from './adminSection/adminSection';
import CreatorSection from './creatorSection/creatorSection';

import './profile.css';

const Profile = (props) => {
    const { userProfile, setUserEvents, setUserRoles, getFromLocal, deleteEvent } = useContext(UsersContext);
    const { removeFromEvents } = useContext(EventsContext)
    const [ refresher, setRefresher ] = useState(true)
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

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
        // async function getData() {
        //     const events = await AxiosInstance.get(`events/user/${parseInt(localStorage.getItem('userId'))}`)
        //     setUserEvents(events.data)
        //     const userRoles = await AxiosInstance.get(`roles/user/${parseInt(localStorage.getItem('userId'))}`)
        //     setUserRoles(userRoles.data)
        //     return
        // }
        // getData()
    }, [refresher]);

    return (
        <div className='componentWrapper'>
            <div className='account'>
                <div className='userinfo'>
                    <h3>{userProfile.username}</h3>
                </div>
            </div>
            {
                (isAdmin) && 
                    <AdminSection />
            }
            <CreatorSection remove={removeEvent}/>
        </div>
    )
}

export default withRouter(Profile);