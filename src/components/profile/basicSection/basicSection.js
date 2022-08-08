import React, { useContext } from 'react';
import { Accordion, Col, Image, Row } from 'react-bootstrap';

import CreatorRequest from './creatorRequest';
import NewBusinessButton from '../../business/newBusinessButton';
import NewEventButton from '../../events/newEventButton';
import UpcomingCreatedBy from '../../events/upcoming/upcoming.created_by';

import { UsersContext } from '../../../context/users/users.provider';
import UserRoles from './userRoles';
import AccountDetails from './accountDetails';

const BasicSection = () => {
    const { setAccountType } = useContext(UsersContext);
    const account_type = setAccountType()


    return (
        <div className='border border-danger'>
            <AccountDetails />
            <Row className='m-0 py-2'>
                <Col xs={6} className='m-0 p-0'>
                    <NewBusinessButton />
                </Col>
                {
                    (account_type !== 'basic') &&
                        <Col xs={6} className='m-0 p-0 text-end'>
                            <NewEventButton />
                        </Col>
                }
            </Row>
            <CreatorRequest />
            <UserRoles />
            <Accordion>
                {/* {
                    (account_type !== 'basic') ?
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>Current Roles</Accordion.Header>
                            <Accordion.Body>
                                <UserRoles />
                            </Accordion.Body>
                        </Accordion.Item> : null
                } */}
                {
                    (account_type !== 'basic') ?
                        <Accordion.Item eventKey="5">
                            <Accordion.Header>Upcoming Created Events</Accordion.Header>
                            <Accordion.Body>
                                <UpcomingCreatedBy />
                            </Accordion.Body>
                        </Accordion.Item> : null
                }
            </Accordion>
        </div>
    )
}

export default BasicSection;