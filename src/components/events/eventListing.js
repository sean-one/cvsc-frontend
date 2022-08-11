import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { Col, Image, Row } from 'react-bootstrap';

import EventControls from './eventControls';

const EventListing = ({ event_list, location }) => {
    return (
        <div>
            {
                event_list.map(event => {
                    return (
                        <div key={event.event_id} className='bg-light border border-dark'>
                            {/* date and event name */}
                            <Row className='fs-6 lh-base p-1 fw-bold'>
                                <Col xs={2}>
                                    {`${format(new Date(event.eventdate), 'MM/dd')}`}
                                </Col>
                                <Col xs={10} className='text-center'>
                                    <Link to={{
                                        pathname: `/event/${event.event_id}`,
                                        state: {
                                            event,
                                            from: location.pathname
                                        }
                                    }}>{`${event.eventname.toUpperCase()}`}</Link>
                                </Col>
                            </Row>
                            {/* thumbnail and event info */}
                            <Row>
                                <Col xs={5}>
                                    <Image src={event.eventmedia} thumbnail />
                                </Col>
                                <Col xs={7}>
                                    <Row>{`created by: ${event.event_creator}`}</Row>
                                    <Row>{`venue: ${event.venue_name}`}</Row>
                                    <Row>{`brand: ${event.brand_name}`}</Row>
                                    <EventControls event={event}/>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default withRouter(EventListing);