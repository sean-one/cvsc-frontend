import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Accordion } from 'react-bootstrap';

// Basic Section Tabs
import CreatorRequest from './creatorRequest';
import UserSection from './userSection';

const BasicSection = () => {


    return (
        <Row>
            <h3>Basic Section</h3>
            <Accordion >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>User Profile</Accordion.Header>
                    <Accordion.Body>
                        <UserSection />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Creator Request</Accordion.Header>
                    <Accordion.Body>
                        <CreatorRequest />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Link to={{ pathname: '/create/business' }}>Create Business</Link>
        </Row>
    )
}

export default BasicSection;