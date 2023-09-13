import React, { useState } from 'react';

import Role from '../../roles/role';

const UserRoles = ({ roles }) => {
    const [viewCurrent, setViewCurrent] = useState(true)
    const [viewInactive, setViewInactive] = useState(false)
    let active_roles = []
    let inactive_roles = []

    if(roles) {
        active_roles = roles.filter(role => role.active_role)
        inactive_roles = roles.filter(role => !role.active_role)
    }
    
    const toggleCurrent = () => {
        setViewCurrent(!viewCurrent)
    };

    const toggleInactive = () => {
        setViewInactive(!viewInactive)
    };


    return (
        <div>
            <div className='sectionContainer'>
                <div className='sectionHeader'>
                    <div>Current Roles</div>
                    <div onClick={() => toggleCurrent()}>{viewCurrent ? 'hide' : 'view'}</div>
                </div>
                {
                    viewCurrent &&
                        <div>
                            {
                                active_roles.map(role =>
                                    <Role key={role.id} role={role} rolelist='userlist' />
                                )
                            }
                        </div>
                }
            </div>

            {
                (inactive_roles.length > 0) &&
                    <div className='sectionContainer'>
                        <div className='sectionHeader'>
                            <div>Inactive Roles</div>
                            <div onClick={() => toggleInactive()}>{viewInactive ? 'hide' : 'view'}</div>
                        </div>
                        {
                            viewInactive &&
                                <div>
                                    {
                                        inactive_roles.map(role =>
                                            <Role key={role.id} role={role} rolelist='userlist' />
                                        )
                                    }
                                </div>
                        }
                    </div>
            }
        </div>
    )
}

export default UserRoles;