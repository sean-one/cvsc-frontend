import React from 'react';
import { Accordion, Row } from 'react-bootstrap';

import CreateBusiness from '../../business/createBusiness';
import UpcomingEvents from './upcomingEvents/upcomingEvents';

// import './creatorSection.css';

const CreatorSection = () => {

    return (
        <Row>
            <h3>Creator Options</h3>
            <Accordion >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Create Event</Accordion.Header>
                    <Accordion.Body>
                        <CreateBusiness />
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