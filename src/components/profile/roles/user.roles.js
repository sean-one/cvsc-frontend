import React from 'react';
import styled from 'styled-components';

import Role from './role';

const UserRolesStyles = styled.div`
    .currentRoles {
        display: flex;
        flex-direction: column;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-radius: 5px;
    }

    .currentRolesHeader {
        display: flex;
        font-weight: bold;
        letter-spacing: 0.1rem;
        border-bottom: 2px solid black;
    }
`;

const UserRoles = ({ roles }) => {

    if(roles) { roles.sort((a,b) => b.active_role - a.active_role) }
    

    return (
        <UserRolesStyles>
            <div className='currentRoles'>

                <div className='currentRolesHeader'>
                    <div>Current Roles</div>
                </div>

                <div>
                    {
                        roles.map(role =>
                            <Role key={role.id} role={role} />
                        )
                    }
                </div>
            </div>
        </UserRolesStyles>
    )
}

export default UserRoles;