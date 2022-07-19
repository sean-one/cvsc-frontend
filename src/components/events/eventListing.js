import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { Col, ListGroup, Row } from 'react-bootstrap';

import EditEventButton from '../editButtonModals/editEventButton';

const EventListing = ({ event_list, business_type, location }) => {
    return (
        <ListGroup className='px-2'>
            {
                event_list.map(event => {
                    return (
                        <ListGroup.Item key={event.event_id} className='d-flex'>
                            <Col sm={1} className='m-0 px-0'>
                                {`${format(new Date(event.eventdate), 'MM/dd')}`}
                            </Col>
                            <Col sm={4} className='m-0 px-0'>
                                <Link to={{
                                    pathname: `/event/${event.event_id}`,
                                    state: {
                                        event,
                                        from: location.pathname
                                    }
                                }}>{`${event.eventname}`}</Link>
                            </Col>
                            <Col sm={2} className='m-0 px-0'>
                                {`${event.event_creator}`}
                            </Col>
                            <Col sm={3} className='m-0 px-0'>
                                <Row style={business_type === 'brand' ? { display: 'none' } : {}}>{`${event.brand_name}`}</Row>
                                <Row style={business_type === 'venue' ? { display: 'none' } : {}}>{`${event.venue_name}`}</Row>
                            </Col>
                            <EditEventButton event={event} />
                        </ListGroup.Item>
                    )
                })
            }
        </ListGroup>
    )
}

export default withRouter(EventListing);