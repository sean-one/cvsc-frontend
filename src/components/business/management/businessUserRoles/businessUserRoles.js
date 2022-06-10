import React from 'react';
import { Accordion, Row } from 'react-bootstrap';

import PendingRoleList from './pendingRoleList';
import CreatorRoleList from './creatorRoleList';
import ManagerRoleList from './managerRoleList';

const BusinessUserRoles = ({ business_role }) => {

    return (
        <Row className='m-2 px-0'>
            <h4>Business Roles</h4>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Pending Creator Request</Accordion.Header>
                    <Accordion.Body>
                        <PendingRoleList />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Creators</Accordion.Header>
                    <Accordion.Body>
                        <CreatorRoleList />
                    </Accordion.Body>
                </Accordion.Item>
                {
                    (business_role.role_type !== 'admin')
                        ? null
                        : <Accordion.Item eventKey="2">
                            <Accordion.Header>Managers</Accordion.Header>
                            <Accordion.Body>
                                <ManagerRoleList />
                            </Accordion.Body>
                        </Accordion.Item>
                }
            </Accordion>
        </Row>
    )
}

export default BusinessUserRoles;