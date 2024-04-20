import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';

import BusinessRole from '../../../roles/business.role';


const PendingRoles = ({ roles_list }) => {
    const [viewRequest, setViewRequest] = useState(false);

    const toggleRequest = () => {
        setViewRequest(!viewRequest)
    }


    return (
        <div className='rolesListSection'>
            <div className='rolesListSectionHeader'>
                <div className='subheaderText'>Request</div>
                <div onClick={() => toggleRequest()}>{viewRequest ? <FaCaretUp className='siteIcons' /> : <FaCaretDown className='siteIcons' />}</div>
            </div>
            {
                viewRequest &&
                    <div>
                        {
                            roles_list.map(role =>
                                <BusinessRole key={role.id} role={role} list_type='pending' />
                            )
                        }
                    </div>
            }
        </div>
    )
}

export default PendingRoles;