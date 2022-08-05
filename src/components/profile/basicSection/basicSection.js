import React, { useContext } from 'react';
import { Accordion, Col, Image, Row } from 'react-bootstrap';

import CreatorRequest from './creatorRequest';
import NewBusinessButton from '../../business/newBusinessButton';
import NewEventButton from '../../events/newEventButton';
import UpcomingCreatedBy from '../../events/upcoming/upcoming.created_by';

import { UsersContext } from '../../../context/users/users.provider';
import UserRoles from './userRoles';

const BasicSection = () => {
    const { userProfile, setAccountType } = useContext(UsersContext);
    const account_type = setAccountType()


    return (
        <Row className='my-3'>
            <Row className='pb-2'>
                <Col xs={5}>
                    <Image thumbnail roundedCircle src={userProfile.avatar} alt={userProfile.username} />
                </Col>
                <Col xs={7} className='d-flex flex-column justify-content-center'>
                    <Row>{userProfile.username}</Row>
                    <Row>{userProfile.email}</Row>
                    <Row>{`Account Type: ${account_type.toUpperCase()}`}</Row>
                </Col>
            </Row>
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
            {/* <UserRoles /> */}
            <Accordion>
                {
                    (account_type !== 'basic') ?
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>Current Roles</Accordion.Header>
                            <Accordion.Body>
                                <UserRoles />
                            </Accordion.Body>
                        </Accordion.Item> : null
                }
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
        </Row>
    )
}

export default BasicSection;