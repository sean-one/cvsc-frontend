import React from 'react';

import DowngradeButton from './buttons/downgradeButton';
import RemoveRoleButton from './buttons/removeRoleButton';

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
                                <DowngradeButton role_id={role.id} />
                            </div>
                            <div className='mx-1'>
                                <RemoveRoleButton role_id={role.id} />
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ManagerRoles;