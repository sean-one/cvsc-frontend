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
                    <Container>
                        <Row>
                            <Col lg={2} style={{ border: 'dotted 1px green', height: '100vh' }}>
                                {/* filter options area */}
                            </Col>
                            <Col lg={7}>
                                <div className='calendar'>
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
                            </Col>
                                <Col lg={3} style={{ border: 'dotted 1px green', height: '100vh' }}>
                                {/* bottom, right ad space area */}
                            </Col>
                        </Row>
                    </Container>
                )
            }
        </div>
    )
}

export default Calendar;