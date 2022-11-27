import React from 'react';
import { Accordion } from 'react-bootstrap';

import useAuth from '../../hooks/useAuth';
import { useBusinessRolesQuery } from '../../hooks/useBusinessApi';
import LoadingSpinner from '../loadingSpinner';
import RolesList from '../roles/rolesList';

const BusinessUserRoles = ({ business }) => {
    const { auth } = useAuth()
    const { data: business_roles, isLoading } = useBusinessRolesQuery(business.id)

    if(isLoading) {
        return <LoadingSpinner />
    }

    // remove admin role from list
    const business_roles_minus_admin = business_roles.data.filter(business_role => (business_role.role_type !== '789'))
    // separate roles by role type
    const pending_roles = business_roles_minus_admin.filter(business_role => !business_role.active_role)
    const creator_roles = business_roles_minus_admin.filter(business_role => (business_role.role_type === '123' && business_role.active_role))
    const manager_roles = business_roles_minus_admin.filter(business_role => (business_role.role_type === '456' && business_role.active_role))


    return (
        <div>
            {
                (Object.keys(business_roles_minus_admin).length > 1) && (
                    <h6 className='my-2'>Business Roles</h6>
                )
            }
            <Accordion>
                {
                    (pending_roles.length > 0)
                        ? <Accordion.Item eventKey="0">
                            <Accordion.Header>Pending Creator Request</Accordion.Header>
                            <Accordion.Body className='m-0 p-0'>
                                <RolesList roles_list={pending_roles} list_type='pending' />
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
                {
                    (creator_roles.length > 0)
                        ? <Accordion.Item eventKey="1">
                            <Accordion.Header>Creators</Accordion.Header>
                            <Accordion.Body className='px-1 py-1'>
                                <RolesList roles_list={creator_roles} list_type='creator'/>
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
                {
                    (manager_roles.length > 0 && auth.user.id === business.business_admin)
                        ? <Accordion.Item eventKey="2">
                            <Accordion.Header>Managers</Accordion.Header>
                            <Accordion.Body className='px-1 py-1'>
                                <RolesList roles_list={manager_roles} list_type='manager'/>
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
            </Accordion>
        </div>
    )
}

export default BusinessUserRoles;