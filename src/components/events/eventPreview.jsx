import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis, faClinicMedical } from '@fortawesome/free-solid-svg-icons';

import { formatTime } from '../../helpers/formatTime';

const EventPreview = ({ event, location }) => {

    const detailPreview = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }
    
    return (
        <Card className='my-3'>
            <Card.Img variant='top' src={event.eventmedia} />
            <Col md={8}>
                <Card.Body className='py-1 px-2 mx-0'>
                    <Card.Title className='my-0 py-1'>{event.eventname.toUpperCase()}</Card.Title>
                    <Card.Subtitle>
                        <Row className='fst-italic'>
                            <Col xs={6}>{format(new Date(event.eventdate), 'E, MMM d')}</Col>
                            <Col xs={6} className='text-end'>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</Col>
                        </Row>
                    </Card.Subtitle>
                    <Card.Text>
                        <Row className='mx-0 py-1 border-bottom'></Row>
                        <Row className='py-1'>
                            <Col className='d-flex justify-content-center px-4'>
                                <Col xs={1}><FontAwesomeIcon icon={faClinicMedical} /></Col>
                                <Col xs={5} className='border-end'>
                                    <Link to={{ pathname: `/business/${event.venue_id}` }}>
                                        {event.venue_name}
                                    </Link>

                                </Col>
                                <Col xs={5} className='text-end'>
                                    <Link to={{ pathname: `/business/${event.brand_id}` }}>
                                        {event.brand_name}
                                    </Link>
                                </Col>
                                <Col xs={1} className='text-end'><FontAwesomeIcon icon={faCannabis} /></Col>
                            </Col>
                        </Row>    
                    </Card.Text>
                </Card.Body>
            </Col>
        </Card>
    )
}

export default withRouter(EventPreview);