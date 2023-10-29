import React, { useState } from 'react';

import { ShowIcon, HideIcon } from '../../../icons/siteIcons';
import BusinessRole from '../../../roles/business.role';


const ManagerRoles = ({ roles_list }) => {
    const [viewManagers, setViewManagers] = useState(true)

    const toggleManagers = () => {
        setViewManagers(!viewManagers)
    }


    return (
        <div className='sectionContainer'>
            <div className='sectionRowSplit'>
                <div className='subheaderText'>Managers</div>
                <div onClick={() => toggleManagers()}>{viewManagers ? <HideIcon /> : <ShowIcon />}</div>
            </div>
            {
                viewManagers &&
                    <div>
                        {
                            roles_list.map(role =>
                                <BusinessRole key={role.id} role={role} list_type='manager' />
                            )
                        }
                    </div>
            }
        </div>
    )
}

export default ManagerRoles;