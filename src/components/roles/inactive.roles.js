import React from 'react';

import { role_types } from '../../helpers/dataCleanUp';
import RemoveRoleButton from './buttons/removeRoleButton';


const InactiveRoles = ({ roles_list }) => {
    return (
        <div className='bg-light rounded p-1 mb-2'>
            <h6>INACTIVE</h6>
            {
                roles_list.map(role =>
                    <div key={role.id} className='d-flex justify-content-between align-items-end ps-2 py-1 border-bottom rounded-bottom'>
                        <div className='text-danger flex-fill'>{role.username}</div>
                        <div className='text-danger mx-1'>{role_types[role.role_type]}</div>
                        <div className='text-danger mx-1'>inactive</div>
                        <div className='mx-1'>
                            <RemoveRoleButton role_id={role.id} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default InactiveRoles;