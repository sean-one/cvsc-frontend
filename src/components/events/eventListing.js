import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { Col, Image, ListGroup, Row } from 'react-bootstrap';

import EventControls from './eventControls';

const EventListing = ({ event_list, location }) => {
    return (
        <ListGroup className='px-2'>
            {
                event_list.map(event => {
                    return (
                        <ListGroup.Item key={event.event_id} className='my-1 py-1'>
                            <Row className='fs-5 lh-base p-1 fw-bold'>
                                <Col xs={2} className='m-0 px-0'>
                                    {`${format(new Date(event.eventdate), 'MM/dd')}`}
                                </Col>
                                <Col xs={10} className='m-0 px-0 text-center'>
                                    <Link to={{
                                        pathname: `/event/${event.event_id}`,
                                        state: {
                                            event,
                                            from: location.pathname
                                        }
                                    }}>{`${event.eventname}`}</Link>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={5}>
                                    <Image src={event.eventmedia} thumbnail />
                                </Col>
                                <Col xs={7} className='py-2'>
                                    <Row>{`created by: ${event.event_creator}`}</Row>
                                    <Row>{`venue: ${event.venue_name}`}</Row>
                                    <Row>{`brand: ${event.brand_name}`}</Row>
                                    <Row>
                                        <EventControls event={event}/>
                                    </Row>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    )
                })
            }
        </ListGroup>
    )
}

export default withRouter(EventListing);