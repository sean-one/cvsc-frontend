import React, { useState } from 'react';

import Role from './role';

const ManagerRoles = ({ roles_list }) => {
    const [viewManagers, setViewManagers] = useState(true)

    const toggleManagers = () => {
        setViewManagers(!viewManagers)
    }


    return (
        <div className='sectionContainer'>
            <div className='sectionHeader sectionListHeader'>
                <div>Managers</div>
                <div onClick={() => toggleManagers()}>{viewManagers ? 'hide' : 'view'}</div>
            </div>
            {
                viewManagers &&
                    <div>
                        {
                            roles_list.map(role =>
                                <Role key={role.id} role={role} rolelist='managerlist' />
                            )
                        }
                    </div>
            }
        </div>
    )
}

export default ManagerRoles;