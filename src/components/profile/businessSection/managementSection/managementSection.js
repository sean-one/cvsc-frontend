import React from 'react';
import { Row, Accordion } from 'react-bootstrap';

import PendingRequest from '../pendingRequest';
import CreatorEvents from '../creatorEvents';


const ManagementSection = () => {

    return (
        <Row className='my-3'>
            <Accordion >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Pending Request</Accordion.Header>
                    <Accordion.Body>
                        <PendingRequest />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Creator Events</Accordion.Header>
                    <Accordion.Body>
                        <CreatorEvents />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Row>
    )
}

export default ManagementSection;