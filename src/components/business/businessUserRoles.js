import React, { useCallback, useEffect, useContext } from 'react';
import { Accordion, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { SiteContext } from '../../context/site/site.provider';

const BusinessUserRoles = ({ business_id }) => {
    const { setBusinessUserRoles, usePending, useCreators, useManagers } = useContext(SiteContext)
    const pending_roles = usePending
    const creator_roles = useCreators
    const manager_roles = useManagers

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
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Pending Request</Accordion.Header>
                    <Accordion.Body>
                        {
                            pending_roles.map(role => <p key={role.id}>{`${role.username} - request for: ${role.role_type}`}</p>)
                        }
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Creators</Accordion.Header>
                    <Accordion.Body>
                        {
                            creator_roles.map(role => <p key={role.id}>{`${role.username} / ${role.role_type}`}</p>)
                        }
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Managers</Accordion.Header>
                    <Accordion.Body>
                        {
                            manager_roles.map(role => <p key={role.id}>{`${role.username} / ${role.role_type}`}</p>)
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Row>
    )
}

export default BusinessUserRoles;