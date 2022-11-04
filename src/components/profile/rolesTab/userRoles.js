import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { UsersContext } from '../../../context/users/users.provider';
import { role_types } from '../../../helpers/dataCleanUp';

const UserRoles = () => {
    const { userRoles } = useContext(UsersContext)

    // sort list to put active roles towards top of the list
    userRoles.sort((a,b) => b.active_role - a.active_role)

    return (
        <div className='my-3'>
            {
                (userRoles.length > 0) &&
                    <h6>Current Roles</h6>
            }
            {
                userRoles.map(role => (
                    <div key={role.business_id} className={`d-flex justify-content-space-between border-bottom ${!role.active_role && 'text-danger'}`}>
                        <Col xs={1} className=''>
                            {role_types[role.role_type].charAt().toUpperCase()}
                            {/* {role.role_type.charAt().toUpperCase()} */}
                        </Col>
                        <Col xs={8}>
                            {role.business_name}
                        </Col>
                        <Col xs={2}>
                            {role.active_role ? 'Active' : 'pending' }
                        </Col>
                        <Col xs={1} className='text-end'><FontAwesomeIcon icon={faTrash} /></Col>
                    </div>
                ))
            }
        </div>
    )
}

export default UserRoles;