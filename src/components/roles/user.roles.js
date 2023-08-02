import React, { useState } from 'react';
import styled from 'styled-components';

import Role from './role';

const UserRolesStyles = styled.div`
    .userRolesWrapper {
        display: flex;
        flex-direction: column;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-radius: 5px;
    }

    .userRolesContainer {
        display: flex;
        flex-direction: column;
        margin: 0.35rem 0;
    }

    .userRolesHeader {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        letter-spacing: 0.1rem;
        border-bottom: 2px solid black;
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
            <div className='userRolesWrapper'>

                <div className='userRolesContainer'>
                    <div className='userRolesHeader'>
                        <div>Current Roles</div>
                        <div onClick={() => toggleCurrent()}>toggle</div>
                    </div>
                    {
                        viewCurrent &&
                            <div>
                                {
                                    active_roles.map(role =>
                                        <Role key={role.id} role={role} />
                                    )
                                }
                            </div>
                    }
                </div>

                <div className='userRolesContainer'>
                    <div className='userRolesHeader'>
                        <div>Inactive Roles</div>
                        <div onClick={() => toggleInactive()}>toggle</div>
                    </div>
                    {
                        viewInactive &&
                            <div>
                                {
                                    inactive_roles.map(role =>
                                        <Role key={role.id} role={role} />
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