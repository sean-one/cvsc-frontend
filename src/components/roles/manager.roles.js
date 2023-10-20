import React, { useState } from 'react';

import { ShowIcon, HideIcon } from '../icons/siteIcons';
import Role from './role';

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
                                <Role key={role.id} role={role} rolelist='managerlist' />
                            )
                        }
                    </div>
            }
        </div>
    )
}

export default ManagerRoles;