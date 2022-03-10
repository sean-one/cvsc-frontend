import React from 'react';
import { Row, Accordion } from 'react-bootstrap';

import PendingRequest from './pendingRequest';
import BusinessList from './businessList';

import './businessAdminSection.css';


const BusinessAdminSection = () => {

    return (
        <Row className='my-3'>
            <h3>Business Admin Options</h3>
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
            </Accordion>
        </Row>
    )

}

export default BusinessAdminSection;