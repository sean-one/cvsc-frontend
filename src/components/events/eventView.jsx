import React, { useState, useEffect, useContext } from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'

import { formatTime } from '../../helpers/formatTime';
import { SiteContext } from '../../context/site/site.provider';

import EditEventButton from '../editButtonModals/editEventButton';
import UpcomingEvents from './upcoming/upcoming.events';
import { Link } from 'react-router-dom';


const EventView = (props) => {
    const { useEventById } = useContext(SiteContext)
    const event = useEventById(props.match.params.id)
    const [ isCreator, setIsCreator ] = useState(false)
    
    
    const checkMap = (e) => {
        console.log('click')
    }
    
    // check if user created event to show edit and delete options
    useEffect(() => {
        const user_id = localStorage.getItem('userId')
        if (!user_id) {
            return
        } else {
            if (event.created_by === user_id) {
                setIsCreator(true)
            } else {
                return
            }
        }
    }, [event.created_by])

    return (
        <Container className='px-0'>
            <Row className='d-flex justify-content-between'>
                <Col xs={10}>
                    <h2>{event.eventname}</h2>
                </Col>
                <Col className={`${isCreator ? 'd-block p-0 m-0' : 'd-none'}`}>
                    <EditEventButton event={event} />
                </Col>
            </Row>
            <Row className='mx-auto my-3'>
                <Image fluid src={event.eventmedia} alt={event.eventname} />
            </Row>
            <Row className='d-flex flex-row mx-3'>
                <Col xs={1}>
                    <FontAwesomeIcon onClick={(e) => checkMap(e)} icon={faLocationArrow} size='1x' />
                </Col>
                <Col className='fw-bold'>
                    {event.venue_name}
                </Col>
            </Row>
            <Row className='d-flex justify-content-end me-3 fs-4 fw-bold'>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</Row>
            <Row className='py-3 m-2 fs-4 lh-lg border-top'>
                {event.details}
            </Row>
            <Row className='py-3 m-2 fw-bold border-bottom'>
                <Link to={{
                    pathname: `/business/${event.brand_id}`
                }}>
                    {`With Brand: ${event.brand_name}`}
                </Link>
            </Row>
            <Row>
                <UpcomingEvents event={event.event_id}/>
            </Row>
        </Container>
    )
}

export default EventView