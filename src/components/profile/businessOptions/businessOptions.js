import React from 'react';
import { Accordion, Row } from 'react-bootstrap';

import CreateEvent from '../../events/createEvent';
import UserEvents from './userEvents';

const BusinessOptions = () => {
    return (
        <Row className='my-3'>
            <h3>Business Options</h3>
            <Accordion >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Create Event</Accordion.Header>
                    <Accordion.Body>
                        <CreateEvent />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Upcoming Events</Accordion.Header>
                    <Accordion.Body>
                        <UserEvents />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Row>
    )
}

export default BusinessOptions;