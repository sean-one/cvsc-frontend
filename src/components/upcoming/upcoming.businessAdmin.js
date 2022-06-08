import React, { useContext } from 'react';
import { format } from 'date-fns';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { SiteContext } from '../../context/site/site.provider';

const UpcomingBusinessAdmin = ({ business_id, business_type }) => {
    const { useEventsByBusiness } = useContext(SiteContext);
    const upcoming_events = useEventsByBusiness(business_id)
    
    return (
        <Row className='m-2 px-0'>
            <h4>Upcoming Events</h4>
            <ListGroup className='px-2'>
                {
                    upcoming_events.map(event => {
                        return (
                            <ListGroup.Item key={event.id} className='d-flex'>
                                <Col sm={1} className='m-0 px-0'>
                                    {`${format(new Date(event.eventdate), 'MM/dd')}`}
                                </Col>
                                <Col sm={4} className='m-0 px-0'>
                                    {`${event.eventname}`}
                                </Col>
                                <Col sm={2} className='m-0 px-0'>
                                    {`${event.event_creator}`}
                                </Col>
                                <Col sm={3} className='m-0 px-0'>
                                    <Row style={ business_type === 'brand' ? { display:'none'} : {} }>{`${event.brand_name}`}</Row>
                                    <Row style={ business_type === 'venue' ? { display:'none'} : {} }>{`${event.venue_name}`}</Row>
                                </Col>
                                <Col sm={1} className='m-0 px-0'>
                                    <Button size='sm' variant='info'>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                </Col>
                                <Col sm={1} className='m-0 px-0'>
                                    <Button size='sm' variant='danger'>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </Col>
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
        </Row>
    )
}

export default UpcomingBusinessAdmin;