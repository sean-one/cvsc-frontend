import React, { useState } from 'react';

import Role from './role';


const InactiveRoles = ({ roles_list }) => {
    const [viewInactive, setViewInactive] = useState(true)

    const toggleInactive = () => {
        setViewInactive(!viewInactive)
    }


    return (
        <div className='rolesListWrapper'>
            <div className='rolesListHeader'>
                <div>Inactive</div>
                <div onClick={() => toggleInactive()}>toggle</div>
            </div>
            <div>
                {
                    roles_list.map(role =>
                        <Role key={role.id} role={role} rolelist='inactivelist' />
                    )
                }

            </div>
        </div>
    )
}

export default InactiveRoles;