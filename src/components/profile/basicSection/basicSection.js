import React, { useContext } from 'react';
import { Row, Accordion } from 'react-bootstrap';

import CreatorRequest from './creatorRequest';
import UserSection from './userSection';
import CreateBusiness from '../../business/createBusiness';
import CreateEvent from '../../events/createEvent';
import UpcomingCreatedBy from '../../events/upcoming/upcoming.created_by';

import { UsersContext } from '../../../context/users/users.provider';
import { useUserRolesQuery } from '../../../hooks/useUserAuthApi';
import UserRoles from './userRoles';

const BasicSection = ({ user_id }) => {
    const { data: roles, isLoading } = useUserRolesQuery(user_id)
    const { setAccountType } = useContext(UsersContext);

    if(isLoading) {
        return <div>loading...</div>
    }

    const account_type = setAccountType(roles.data)

    return (
        <Row className='my-3'>
            <h3>Basic Section</h3>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>User Profile</Accordion.Header>
                    <Accordion.Body>
                        <UserSection user_id={user_id} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Creator Request</Accordion.Header>
                    <Accordion.Body>
                        <CreatorRequest />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Create Business</Accordion.Header>
                    <Accordion.Body>
                        <CreateBusiness />
                    </Accordion.Body>
                </Accordion.Item>
                {
                    (account_type !== 'basic') ?
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Create Event</Accordion.Header>
                            <Accordion.Body>
                                <CreateEvent />
                                {/* <CreateEvent venue_list={useVenueList} brand_list={useBrandList} /> */}
                            </Accordion.Body>
                        </Accordion.Item> : null
                }
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
                                <UpcomingCreatedBy user_id={user_id} />
                            </Accordion.Body>
                        </Accordion.Item> : null
                }
            </Accordion>
        </Row>
    )
}

export default BasicSection;