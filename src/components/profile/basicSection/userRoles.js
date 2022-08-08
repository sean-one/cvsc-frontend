import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';

import { UsersContext } from '../../../context/users/users.provider';


const UserRoles = () => {
    const { userRoles } = useContext(UsersContext)

    return (
        <Row className='m-0 p-0 border'>
            <Col xs={12} className='mx-1 p-0 bg-light bg-opacity-50'>
                <h6>Current Roles</h6>
                {/* {
                    userRoles.map(role => (
                        <div key={role.business_id} className={`d-flex justify-content-space-between border-bottom ${!role.active_role && 'text-secondary'}`}>
                        <Col xs={1} className=''>
                        {role.role_type.charAt().toUpperCase()}
                        </Col>
                        <Col xs={8}>
                        {role.business_name}
                        </Col>
                        <Col xs={2}>
                        {role.active_role ? 'Active' : 'pending' }
                        </Col>
                        
                        </div>
                        ))
                } */}
            </Col>
        </Row>
    )
}

export default UserRoles;