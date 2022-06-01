import React, { useContext } from 'react';
import { Accordion, Row } from 'react-bootstrap';

import { UsersContext } from '../../../context/users/users.provider';
import PendingRequest from './pendingRequest';
import CreatorEvents from './creatorEvents';
import BusinessList from './businessList';


const BusinessSection = () => {
    const { userProfile } = useContext(UsersContext)
    
    return (
        <Row className='my-3'>
            <h3>{`${userProfile.account_type.charAt(0).toUpperCase() + userProfile.account_type.slice(1)} Options`}</h3>
            <Accordion >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Pending Creator Request</Accordion.Header>
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
                {
                    (userProfile.account_type === 'admin') ?
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Business List</Accordion.Header>
                            <Accordion.Body>
                                <BusinessList />
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
            </Accordion>
        </Row>
    )
}

export default BusinessSection;