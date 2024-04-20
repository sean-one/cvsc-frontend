import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';

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
                <div onClick={() => toggleInactive()}>{viewInactive ? <FaCaretUp className='siteIcons' /> : <FaCaretDown className='siteIcons' />}</div>
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