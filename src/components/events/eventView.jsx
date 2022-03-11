import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'


const EventView = (props) => {
    const event = props.location.state.event
    console.log(props.location.state.event)
    return (
        <Container className='px-0'>
            <Row className='d-flex justify-content-between'>
                <h2>{event.eventname}</h2>
            </Row>
            <Row className='mx-auto'>
                <Image fluid src={event.eventmedia} alt={event.eventname} />
            </Row>
            <Row>
                <Col sm={8}>
                    <p>{event.formatted}</p>
                </Col>
                <Col sm={4}>
                    <p>11:00am - 01:00pm</p>
                </Col>
            </Row>
            <Row>
                <p>{event.details}</p>
            </Row>
        </Container>
    )
}

export default EventView