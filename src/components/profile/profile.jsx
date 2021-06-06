import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { sortDaysEvents } from '../calendar/getCalendar';
import Day from '../calendar/day';

import UserContext from '../../context/userContext';
import { isPast } from 'date-fns';
import format from 'date-fns/format';

const Profile = (props) => {
    const { userProfile, setUserProfile } = useContext(UserContext);
    const [ userEvents, setUserEvents ] = useState([]);
    const sortedEvents = sortDaysEvents(userEvents);
    // console.log(userProfile)

    const getUserEvents = async () => {
        const userId = localStorage.getItem('userId')
        if (userId) {
            const events = await AxiosInstance.get(`events/user/${parseInt(userId)}`);
            setUserEvents(events.data);
        } else {
            const events = await AxiosInstance.get(`events/user/${userProfile.id}`);
            setUserEvents(events.data)
        }
    }

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUserProfile(JSON.parse(userData));
        }
        getUserEvents()
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        localStorage.setItem('userId', JSON.stringify(userProfile.id))
        localStorage.setItem('user', JSON.stringify(userProfile));
        // eslint-disable-next-line
    });

    // console.log(sortedEvents);
    return (
        <div className='userProfile'>
            <div className='account'>
                <img src={userProfile.avatar} alt='account avatar' />
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
                    Object.keys(sortedEvents).sort(
                        (a,b) => new Date(a) - new Date(b)
                    ).map(key => {
                        const eventDate = new Date(key)
                        if(!isPast(eventDate)) {
                            return (
                                <Day key={format(eventDate, 't')} date={eventDate} schedule={sortedEvents[key]} />
                            )
                        }
                        return null;
                    })
                }
            </div>
        </div>
    )
}

export default Profile;