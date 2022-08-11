import React from 'react';
import { format } from 'date-fns';
import { Col, Image, Row } from 'react-bootstrap';

import EventControls from './eventControls';

const EventMiniCard = ({ event }) => {
  return (
    <div className='bg-light rounded my-1'>
        <div className='d-flex justify-content-between'>
            <Col xs={2} className='text-center'>
                {format(new Date(event.eventdate), 'MM/dd')}
            </Col>
            <Col xs={10} className='event-card-title text-truncate'>
                {event.eventname}
            </Col>
        </div>
        <Row>
            <Col xs={3}>
                <Image src={event.eventmedia} thumbnail />
            </Col>
            <Col xs={9}>
                <Row>{event.venue_name}</Row>
                <Row>{event.brand_name}</Row>
                <EventControls event={event} />
            </Col>
        </Row>
    </div>
  )
}

export default EventMiniCard;