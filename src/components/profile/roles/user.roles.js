import React, { useState } from 'react';
import styled from 'styled-components';

import Role from '../../roles/role';

const UserRolesStyles = styled.div`
    .userRolesContainer {
        display: flex;
        flex-direction: column;
        margin: 0.35rem 0;
    }
`;

const UserRoles = ({ roles }) => {
    const [viewCurrent, setViewCurrent] = useState(true)
    const [viewInactive, setViewInactive] = useState(true)
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
        <UserRolesStyles>
            <div className='rolesListWrapper'>

                <div className='userRolesContainer'>
                    <div className='rolesListHeader'>
                        <div>Current Roles</div>
                        <div onClick={() => toggleCurrent()}>toggle</div>
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

                <div className='userRolesContainer'>
                    <div className='rolesListHeader'>
                        <div>Inactive Roles</div>
                        <div onClick={() => toggleInactive()}>toggle</div>
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
            </div>
        </UserRolesStyles>
    )
}

export default UserRoles;