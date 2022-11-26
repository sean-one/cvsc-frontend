import React from 'react';
import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../../hooks/useAuth';
import { role_types } from '../../../helpers/dataCleanUp';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import LoadingSpinner from '../../loadingSpinner';

const UserRoles = () => {
    const { auth } = useAuth()
    const { data: businessList, isLoading } = useBusinessesQuery()

    // sort list to put active roles towards top of the list
    auth.roles.sort((a,b) => b.active_role - a.active_role)

    const findBusinessName = (business_id) => {
        const { business_name } = businessList.data.find(business => business.id === business_id)
        return business_name
    }

    if(isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className='my-3'>
            {
                (auth.roles.length > 0) &&
                    <h6>Current Roles</h6>
            }
            {
                auth.roles.map(role => (
                    <div key={role.business_id} className={`d-flex justify-content-space-between border-bottom ${!role.active_role && 'text-danger'}`}>
                        <Col xs={1} className=''>
                            {role_types[role.role_type].charAt().toUpperCase()}
                        </Col>
                        <Col xs={8}>
                            {findBusinessName(role.business_id)}
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