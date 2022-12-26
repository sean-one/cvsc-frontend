import React from 'react';

import { usePendingRolesQuery } from '../../hooks/useBusinessApi';
import LoadingSpinner from '../loadingSpinner';
import ApproveRole from './buttons/approve.role';
import RemoveRole from './buttons/remove.role';

const ManagementRoles = () => {

    const { data: pending_roles, isLoading } = usePendingRolesQuery()

    if (isLoading) {
        return <LoadingSpinner />
    }


    return (
        <div className='bg-light rounded p-1 mb-2'>
            <h6>Pending Business Request</h6>
            {
                pending_roles.data.map(role => (
                    <div key={role.id} className='d-flex justify-content-between align-items-center mb-1'>
                        <div className='flex-fill'>{role.business_name}</div>
                        <div className='flex-fill text-end'>{role.username}</div>
                        <div className='d-flex ps-2 text-end'>
                            <div className='mx-1'>
                                <ApproveRole role_id={role.id} />
                            </div>
                            <div className='mx-1'>
                                <RemoveRole role_id={role.id} />
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ManagementRoles;