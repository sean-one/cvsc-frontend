import React, { useState } from 'react';

import { ShowIcon, HideIcon } from '../../../icons/siteIcons';
import BusinessRole from '../../../roles/business.role';


const InactiveRoles = ({ roles_list }) => {
    const [viewInactive, setViewInactive] = useState(false)

    const toggleInactive = () => {
        setViewInactive(!viewInactive)
    }


    return (
        <div className='rolesListSection'>
            <div className='rolesListSectionHeader'>
                <div className='subheaderText'>Inactive</div>
                <div onClick={() => toggleInactive()}>{viewInactive ? <HideIcon /> : <ShowIcon />}</div>
            </div>
            <div>
                {
                    roles_list.map(role =>
                        <BusinessRole key={role.id} role={role} list_type='inactive' />
                    )
                }

            </div>
        </div>
    )
}

export default InactiveRoles;