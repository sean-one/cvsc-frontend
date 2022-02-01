import React, { useEffect, useContext } from 'react'
import { format } from 'date-fns';

import useSiteFetch from '../../hooks/useSiteFetch';
import useEventsByDay from '../../hooks/useEventsByDay';
import { SiteContext } from '../../context/site/site.provider'

import Day from './day.jsx';

import './calendar.css';

const Calendar = () => {
    const { data, loading, fetchError } = useSiteFetch('...loading data...')
    const { events, setSiteInfo } = useContext(SiteContext)
    const siteSortedEvents = useEventsByDay(events)
    
    useEffect(() => {
        setSiteInfo(data.events, data.businessList)
    }, [data])
    
    
    return (
        <div>
            {
                loading ? (
                    <div>{ fetchError }</div>
                ) : (
                    <div className='calendar'>
                        <p>filter</p>
                        {
                            Object.keys(siteSortedEvents).sort(
                                // sort event list by date
                                (a,b) => new Date(a) - new Date(b)
                            ).map(key => {
                                const eventDate = new Date(key)
                                return (
                                    <Day key={format(eventDate, 't')} date={eventDate} schedule={siteSortedEvents[key]} />
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