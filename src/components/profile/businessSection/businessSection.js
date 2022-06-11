import React, { useContext } from 'react';
import { Accordion, Row } from 'react-bootstrap';

import { UsersContext } from '../../../context/users/users.provider';
import PendingRequest from './pendingRequest';
import BusinessList from './businessList';


const BusinessSection = () => {
    const { useAccountType } = useContext(UsersContext)
    const account_type = useAccountType()
    
    return (
        <Row className='my-3'>
            <h3>{`${account_type.charAt(0).toUpperCase() + account_type.slice(1)} Options`}</h3>
            <Accordion >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Pending Creator Request</Accordion.Header>
                    <Accordion.Body>
                        <PendingRequest />
                    </Accordion.Body>
                </Accordion.Item>
                {
                    (account_type === 'admin' || account_type === 'manager') ?
                        <Accordion.Item eventKey="1">
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