import React, { useContext } from 'react';
import { Row, Accordion } from 'react-bootstrap';

import CreatorRequest from './creatorRequest';
import UserSection from './userSection';
import CreateBusiness from '../../business/createBusiness';
import CreateEvent from '../../events/createEvent';
import UserEvents from './userEvents';

import { UsersContext } from '../../../context/users/users.provider';


const BasicSection = () => {
    const { userProfile } = useContext(UsersContext);

    return (
        <Row className='my-3'>
            <h3>Basic Section</h3>
            <Accordion defaultActiveKey="0">
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
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Create Business</Accordion.Header>
                    <Accordion.Body>
                        <CreateBusiness />
                    </Accordion.Body>
                </Accordion.Item>
                {
                    (userProfile.account_type !== 'basic') ?
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Create Event</Accordion.Header>
                            <Accordion.Body>
                                <CreateEvent />
                                {/* <CreateEvent venue_list={useVenueList} brand_list={useBrandList} /> */}
                            </Accordion.Body>
                        </Accordion.Item> : null
                }
                {
                    (userProfile.account_type !== 'basic') ?
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>Upcoming Events</Accordion.Header>
                            <Accordion.Body>
                                <UserEvents />
                            </Accordion.Body>
                        </Accordion.Item> : null
                }
            </Accordion>
        </Row>
    )
}

export default BasicSection;