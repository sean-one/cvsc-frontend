import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

import './eventPreview.css';

const EventPreview = (props) => {
    const event = props.event;

    const detailPreview = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }
    
    return (
        <Card className='my-3'>
            <Row className='gx-4'>
                <Col md={4} className='mx-auto'>
                    <Card.Img variant='top' src={event.eventmedia} />
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <Card.Title>{event.eventname.toUpperCase()}</Card.Title>
                        <Card.Subtitle>
                            <Link to={{
                                pathname: `/business/${event.venue_id}`
                            }}>{`at ${event.venue_name}`}</Link>
                        </Card.Subtitle>
                        <Card.Text>
                            {detailPreview(event.details, 100)}
                        </Card.Text>
                        <Link to={{
                            pathname: `/events/${event.event_id}`,
                            state: {
                                event,
                                from: props.location.pathname
                            }
                        }}>Read More</Link>
                    </Card.Body>
                </Col>
            </Row>
            <Card.Footer className='d-flex justify-around'>
                <Col>{event.brand_name}</Col>
                <Col>{event.city}</Col>
            </Card.Footer>
        </Card>
        // <Container fluid className='my-3--md'>
        // </Container>
    )
}

export default withRouter(EventPreview);