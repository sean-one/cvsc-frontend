import React from 'react';

import useAuth from '../../hooks/useAuth';
import { role_types } from '../../helpers/dataCleanUp';


const UserRoles = () => {
    const { auth } = useAuth()

    auth?.roles.sort((a,b) => b.active_role - a.active_role)

    console.log(auth.roles)
    return (
        <div className='bg-light rounded p-1'>
            <h6 className='mb-0'>CURRENT ROLES</h6>
            {
                auth.roles.map(role =>
                    <div key={role.id} className={`d-flex justify-content-between align-items-end ps-2 py-1 border-bottom rounded-bottom ${role.active_role ? '' : 'text-danger'}`}>
                        <div className='me-2'>
                            {role_types[role.role_type].charAt().toUpperCase()}
                        </div>
                        <div className='text-start flex-fill'>
                            {role.business_name}
                        </div>
                        <div>
                            {role.active_role ? 'Active' : 'pending'}
                        </div>
                    </div>
                ) 
            }
        </div>
    )
}

export default UserRoles;