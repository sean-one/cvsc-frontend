import React from 'react';
import { Accordion } from 'react-bootstrap';

import PendingRequest from '../pendingRequest';
import BusinessList from './businessList';
import CreatorEvents from '../creatorEvents';


const AdminSection = () => {

    return (
        <Accordion >
            <Accordion.Item eventKey="0">
                <Accordion.Header>Pending Request</Accordion.Header>
                <Accordion.Body>
                    <PendingRequest />
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Business List</Accordion.Header>
                <Accordion.Body>
                    <BusinessList />
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Creator Events</Accordion.Header>
                <Accordion.Body>
                    <CreatorEvents />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}

export default AdminSection;