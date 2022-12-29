import React from 'react';

import { usePendingBusinessRolesQuery } from '../../hooks/useRolesApi';
import LoadingSpinner from '../loadingSpinner';
import ApproveRole from './buttons/approve.role';
import RemoveRole from './buttons/remove.role';

const ManagementRoles = ({ user_id }) => {

    const { data: pending_roles, isLoading } = usePendingBusinessRolesQuery(user_id)

    if (isLoading) {
        return <LoadingSpinner />
    }


    return (
        <>
            {
                (pending_roles.data.length > 0) &&
                    <div className='bg-light rounded p-1 my-2'>
                        <h6>Pending Business Request</h6>
                        {
                            pending_roles.data.map(role => (
                                <div key={role.id} className='d-flex justify-content-between align-items-center ps-2 mb-1'>
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
            }
        </>
    )
}

export default ManagementRoles;