import React, { useContext } from 'react';
import { Accordion, Row } from 'react-bootstrap';

import { SiteContext } from '../../../../context/site/site.provider';
import PendingRoleList from './pendingRoleList';
import CreatorRoleList from './creatorRoleList';
import ManagerRoleList from './managerRoleList';

const BusinessUserRoles = ({ business_role }) => {
    const { useCreators, usePending, useManagers } = useContext(SiteContext)

    return (
        <Row className='m-2 px-0'>
            <h4>Business Roles</h4>
            <Accordion>
                {
                    (usePending.length > 0)
                        ? <Accordion.Item eventKey="0">
                            <Accordion.Header>Pending Creator Request</Accordion.Header>
                            <Accordion.Body>
                                <PendingRoleList />
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
                {
                    (useCreators.length > 0)
                        ? <Accordion.Item eventKey="1">
                            <Accordion.Header>Creators</Accordion.Header>
                            <Accordion.Body>
                                <CreatorRoleList />
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
                {
                    // ((business_role.role_type !== 'admin') && (useManagers.length > 0))
                    (useManagers.length > 0 && business_role.role_type === 'admin')
                        ? <Accordion.Item eventKey="2">
                            <Accordion.Header>Managers</Accordion.Header>
                            <Accordion.Body>
                                <ManagerRoleList />
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
            </Accordion>
        </Row>
    )
}

export default BusinessUserRoles;