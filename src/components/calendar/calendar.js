import React, { useEffect, useContext } from 'react'
import { format } from 'date-fns';
import { Container, Row, Col } from 'react-bootstrap';

import useSiteFetch from '../../hooks/useSiteFetch';
import useEventsByDay from '../../hooks/useEventsByDay';
import { SiteContext } from '../../context/site/site.provider'

import Day from './day.jsx';

const Calendar = () => {
    const { data, loading, fetchError } = useSiteFetch('...loading data...')
    const { events, setSiteInfo } = useContext(SiteContext)
    const siteSortedEvents = useEventsByDay(events)
    
    useEffect(() => {
        setSiteInfo(data.events, data.businessList)
        // eslint-disable-next-line
    }, [data])
    
    
    return (
        <div>
            {
                loading ? (
                    <div>{ fetchError }</div>
                ) : (
                    <Container className='px-0'>
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
                    </Container>
                )
            }
        </div>
    )
}

export default Calendar;