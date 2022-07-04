import React, { useContext } from 'react';
import { Accordion, Row } from 'react-bootstrap';

import { UsersContext } from '../../../context/users/users.provider';
import { useUserRolesQuery } from '../../../hooks/useUserAuthApi';
import PendingRequest from './pendingRequest';
import BusinessList from './businessList';


const BusinessSection = ({ user_id }) => {
    const { data: roles, isLoading } = useUserRolesQuery(user_id)
    const { setAccountType } = useContext(UsersContext)
    
    if (isLoading) {
        return <div>loading...</div>
    }

    const account_type = setAccountType(roles.data)
    // console.log(roles)
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

export default BusinessSection;