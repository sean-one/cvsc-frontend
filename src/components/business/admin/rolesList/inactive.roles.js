import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';

import BusinessRole from '../../../roles/business.role';


const InactiveRoles = ({ roles_list }) => {
    const [viewInactiveBusinessRole, setViewInactiveBusinessRole] = useState(false)

    const toggleInactiveBusinessRole = () => {
        setViewInactiveBusinessRole(!viewInactiveBusinessRole)
    }


    return (
        <div className='rolesListSection'>
            <div className='rolesListSectionHeader'>
                <div className='subheaderText'>Inactive</div>
                <div onClick={() => toggleInactiveBusinessRole()}>
                    {viewInactiveBusinessRole ? <FaCaretUp className='siteIcons' /> : <FaCaretDown className='siteIcons' />}
                </div>
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