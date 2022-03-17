import React from 'react';
import { Accordion, Row } from 'react-bootstrap';

import CreateEvent from '../../events/createEvent';
import UpcomingEvents from './upcomingEvents/upcomingEvents';


const CreatorSection = () => {
    
    return (
        <Row className='my-3'>
            <h3>Creator Options</h3>
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
                        <UpcomingEvents />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Row>
    )
}

export default CreatorSection;