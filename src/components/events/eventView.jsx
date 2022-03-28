import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import UpcomingEventView from '../upcoming/upcoming.eventview'
import { formatTime } from '../../helpers/formatTime';


const EventView = (props) => {
    const event = props.location.state.event
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
            if (event.created_by === Number(user_id)) {
                setIsCreator(true)
            }
        }
    }, [event.created_by])

    return (
        <Container className='px-0'>
            <Row className='d-flex justify-content-between'>
                <Col xs={10}>
                    <h2>{event.eventname}</h2>
                </Col>
                <Col className={`${isCreator ? 'd-flex' : 'd-none'}`}>
                    <Col>
                        <Button size='sm' variant='info'>
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    </Col>
                    <Col>
                        <Button size='sm' variant='danger'>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Col>
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
            <Row className='py-3 m-2 fs-4 lh-lg border-top border-bottom'>
                {event.details}
            </Row>
            <Row>
                <UpcomingEventView event={event.event_id}/>
            </Row>
        </Container>
    )
}

export default EventView