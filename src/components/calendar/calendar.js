import React, { useState, useContext, useEffect } from 'react'
import { format } from 'date-fns';
import AxiosInstance from '../../helpers/axios';

import Day from './day.jsx';

import './calendar.css';
import { EventsContext } from '../../context/events/events.provider.js';
import axios from 'axios';

const Calendar = () => {
    const [ loading, setLoading ] = useState(false)
    const { setCalendar, useSortedEvents } = useContext(EventsContext);
    const sortedEvents = useSortedEvents();

    const getSiteData = () => {
        setLoading(true)
        const eventsApiCall = AxiosInstance.get('/events');
        const businessApiCall = AxiosInstance.get('/business');
        axios.all([ eventsApiCall, businessApiCall ])
            .then(axios.spread((...responses) => {
                // console.log(responses)
                
                // responses[0].data.config.url === '/events'
                const eventListResponse = responses[0].data
                
                // responses[1].data.config.url === '/business'
                const businessListResponse = responses[1].data
                
                setCalendar(eventListResponse, businessListResponse)
                setLoading(false)
            }))
            .catch(err => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getSiteData();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            {
                loading ? (
                    <div> ...loading data... </div>
                ) : (
                    <div className='calendar'>
                        <p>filter</p>
                        {
                            Object.keys(sortedEvents).sort(
                                // sort event list by date
                                (a,b) => new Date(a) - new Date(b)
                            ).map(key => {
                                const eventDate = new Date(key)
                                return (
                                    <Day key={format(eventDate, 't')} date={eventDate} schedule={sortedEvents[key]} />
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Calendar;