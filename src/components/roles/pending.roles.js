import React from 'react';

import ApproveRole from './buttons/approve.role';
import RemoveRole from './buttons/remove.role';
import { role_types } from '../../helpers/dataCleanUp';


const PendingRoles = ({ roles_list }) => {
    return (
        <div className='bg-light rounded p-1 mb-2'>
            <h6>REQUESTS</h6>
            {
                roles_list.map(role =>
                    <div key={role.id} className='d-flex justify-content-between align-items-end ps-2 py-1 border-bottom rounded-bottom'>
                        <div className='flex-fill'>
                            {`${role.username} - ${role_types[role.role_type].type}`}
                        </div>
                        <div className='d-flex'>
                            <div className='mx-1'>
                                <ApproveRole role_id={role.id} />
                            </div>
                            <div className='mx-1'>
                                <RemoveRole role_id={role.id} />
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default PendingRoles;