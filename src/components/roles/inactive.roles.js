import React, { useState } from 'react';

import { ShowIcon, HideIcon } from '../icons/siteIcons';
import Role from './role';


const InactiveRoles = ({ roles_list }) => {
    const [viewInactive, setViewInactive] = useState(true)

    const toggleInactive = () => {
        setViewInactive(!viewInactive)
    }


    return (
        <div className='sectionContainer'>
            <div className='sectionHeader sectionListHeader'>
                <div>Inactive</div>
                <div onClick={() => toggleInactive()}>{viewInactive ? <HideIcon /> : <ShowIcon />}</div>
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