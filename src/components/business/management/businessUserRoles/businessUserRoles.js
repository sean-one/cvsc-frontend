import React, { useContext } from 'react';
import { Accordion, Row } from 'react-bootstrap';

import { useBusinessRolesQuery } from '../../../../hooks/useBusinessApi';
import { UsersContext } from '../../../../context/users/users.provider';
import PendingRoleList from './pendingRoleList';
import CreatorRoleList from './creatorRoleList';
import ManagerRoleList from './managerRoleList';

const BusinessUserRoles = ({ business }) => {
    const { userProfile } = useContext(UsersContext)
    const { data: business_roles, isLoading } = useBusinessRolesQuery(business.id)

    if(isLoading) {
        return <div>loading...</div>
    }

    const pending_roles = business_roles.data.filter(business_role => !business_role.active_role)
    const creator_roles = business_roles.data.filter(business_role => (business_role.role_type === 'creator' && business_role.active_role))
    const manager_roles = business_roles.data.filter(business_role => (business_role.role_type === 'manager' && business_role.active_role))
    
    return (
        <Row className='m-2 px-0'>
            <h4>Business Roles</h4>
            <Accordion>
                {
                    (pending_roles.length > 0)
                        ? <Accordion.Item eventKey="0">
                            <Accordion.Header>Pending Creator Request</Accordion.Header>
                            <Accordion.Body>
                                <PendingRoleList pending_roles={pending_roles} />
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
                {
                    (creator_roles.length > 0)
                        ? <Accordion.Item eventKey="1">
                            <Accordion.Header>Creators</Accordion.Header>
                            <Accordion.Body>
                                <CreatorRoleList creator_roles={creator_roles} />
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
                {
                    (manager_roles.length > 0 && userProfile.id === business.business_admin)
                        ? <Accordion.Item eventKey="2">
                            <Accordion.Header>Managers</Accordion.Header>
                            <Accordion.Body>
                                <ManagerRoleList manager_roles={manager_roles} />
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
            </Accordion>
        </Row>
    )
}

export default BusinessUserRoles;