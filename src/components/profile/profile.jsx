import React, { useState, useContext, useEffect } from 'react';
import AxiosInstance from '../../helpers/axios';

import { sortDaysEvents } from '../calendar/getCalendar';
import Day from '../calendar/day';

import UserContext from '../../context/userContext';
import { isPast } from 'date-fns';
import format from 'date-fns/format';

const Profile = () => {
    const { userProfile } = useContext(UserContext);
    const [ userEvents, setUserEvents ] = useState([]);
    const sortedEvents = sortDaysEvents(userEvents);
    console.log(userProfile)

    const getUserEvents = async () => {
        const events = await AxiosInstance.get(`events/user/${userProfile.id}`);
        setUserEvents(events.data);
    }

    useEffect(() => {
        getUserEvents()
    }, []);

    console.log(sortedEvents);
    return (
        <div className='userProfile'>
            <div className='account'>
                <img src={userProfile.avatar} alt='account avatar' />
                <h1>{`Welcome ${userProfile.username}`}</h1>
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