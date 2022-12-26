import React from 'react';

import DowngradeRole from './buttons/downgrade.role';
import RemoveRole from './buttons/remove.role';


const ManagerRoles = ({ roles_list }) => {
    return (
        <div className='bg-light rounded p-1 mb-2'>
            <h6>MANAGERS</h6>
            {
                roles_list.map(role =>
                    <div key={role.id} className='d-flex justify-content-between align-items-end ps-2 py-1 border-bottom rounded-bottom'>
                        <div className='flex-fill'>{role.username}</div>
                        <div className='d-flex'>
                            <div className='mx-1'>
                                <DowngradeRole role_id={role.id} />
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

export default ManagerRoles;