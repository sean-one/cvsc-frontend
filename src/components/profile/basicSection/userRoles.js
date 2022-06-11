import React, { useContext } from 'react';
import { Col, ListGroup } from 'react-bootstrap';

import { UsersContext } from '../../../context/users/users.provider';


const UserRoles = () => {
    const { userRoles } = useContext(UsersContext)

    return (
        <ListGroup>
            {
                userRoles.map(role => (
                    <ListGroup.Item key={role.business_id} className='d-flex justify-content-space-between' disabled={!role.active_role}>
                        <Col sm={6}>
                            {role.business_name}
                        </Col>
                        <Col sm={3}>
                            {role.role_type}
                        </Col>
                        <Col sm={3}>
                            {role.active_role ? '' : 'pending' }
                        </Col>
                        
                    </ListGroup.Item>
                ))
            }
        </ListGroup>
    )
}

export default UserRoles;