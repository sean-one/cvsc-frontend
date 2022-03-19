import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'

import UpcomingEvents from './upcomingEvents';
import { formatTime } from '../../helpers/formatTime';


const EventView = (props) => {
    const event = props.location.state.event

    const checkMap = (e) => {
        console.log('click')
    }

    return (
        <Container className='px-0'>
            <Row className='d-flex justify-content-between'>
                <h2>{event.eventname}</h2>
            </Row>
            <Row className='mx-auto my-3'>
                <Image fluid src={event.eventmedia} alt={event.eventname} />
            </Row>
            <Row className='d-flex flex-row mx-3' onClick={(e) => checkMap(e)}>
                <Col xs={1}>
                    <FontAwesomeIcon icon={faLocationArrow} size='1x' />
                </Col>
                <Col className='fw-bold'>
                    {event.venue_name}
                </Col>
            </Row>
            <Row className='d-flex justify-content-end me-3 fs-4 fw-bold'>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</Row>
            <Row className='py-3 m-2 fs-4 lh-lg border-top border-bottom'>
                {event.details}
            </Row>
            <Row>
                <UpcomingEvents business={event.venue_name}/>
            </Row>
        </Container>
    )
}

export default EventView