import React, { useCallback, useEffect, useContext } from 'react';
import { Accordion, ListGroup, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { SiteContext } from '../../context/site/site.provider';
import PendingRoleList from './userRoleList/pendingRoleList';
import CreatorRoleList from './userRoleList/creatorRoleList';
import ManagerRoleList from './userRoleList/managerRoleList';

const BusinessUserRoles = ({ business_id }) => {
    const { setBusinessUserRoles, usePending, useCreators, useManagers, useAdminRole } = useContext(SiteContext)
    const pending_roles = usePending
    const creator_roles = useCreators
    const manager_roles = useManagers
    const admin_role = useAdminRole[0]

    const getAllBusinessRoles = useCallback(() => {
        const token = localStorage.getItem('token');

        AxiosInstance.get(`/roles/business/${business_id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(current_roles => {
                setBusinessUserRoles(current_roles.data)
            })  
            .catch(err => {
                console.log(err)
            })
    }, [setBusinessUserRoles, business_id])

    useEffect(() => {
        getAllBusinessRoles()
        // eslint-disable-next-line
    }, []);

    return (
        <Row className='m-2 px-0'>
            <h4>Business Roles</h4>
            <Accordion>
                {
                    pending_roles.length > 0
                        ? <Accordion.Item eventKey="0">
                            <Accordion.Header>Pending Request</Accordion.Header>
                            <Accordion.Body>
                                <PendingRoleList pending_roles={pending_roles} />
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
                {
                    creator_roles.length > 0
                        ? <Accordion.Item eventKey="1">
                            <Accordion.Header>Creators</Accordion.Header>
                            <Accordion.Body>
                                <CreatorRoleList creator_roles={creator_roles} />          
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
                {
                    manager_roles.length > 0
                        ? <Accordion.Item eventKey="2">
                            <Accordion.Header>Managers</Accordion.Header>
                            <Accordion.Body>
                                <ManagerRoleList manager_roles={manager_roles} />         
                            </Accordion.Body>
                        </Accordion.Item>
                        : null
                }
                <ListGroup variant='flush'>
                    {/* <ListGroup.Item>Business Admin</ListGroup.Item> */}
                    <ListGroup.Item>{`Business Admin: ${admin_role.username}`}</ListGroup.Item>
                </ListGroup>
            </Accordion>
        </Row>
    )
}

export default BusinessUserRoles;