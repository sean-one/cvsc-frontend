import React from 'react';

import useAuth from '../../hooks/useAuth';
import { role_types } from '../../helpers/dataCleanUp';
import RemoveUserRole from './buttons/remove.user.role';

const UserRoles = () => {
    const { auth } = useAuth()

    auth?.roles.sort((a,b) => b.active_role - a.active_role)


    return (
        <div className='bg-light rounded p-1 mb-2'>
            <h6 className='mb-0'>CURRENT ROLES</h6>
            {
                auth.roles.map(role =>
                    <div key={role.id} className={`d-flex justify-content-between align-items-end ps-2 pb-1 border-bottom rounded-bottom ${role.active_role ? '' : 'text-danger'}`}>
                        <div className='me-2'>
                            {role_types[role.role_type].charAt().toUpperCase()}
                        </div>
                        <div className='text-start flex-fill'>
                            {role.business_name}
                        </div>
                        <div className='mx-1'>
                            {role.active_role ? 'Active' : 'pending'}
                        </div>
                        {
                            (role.role_type !== '789') &&
                                <div className='mx-1'>
                                    <RemoveUserRole role_id={role.id} />
                                </div>
                        }
                    </div>
                ) 
            }
        </div>
    )
}

export default UserRoles;