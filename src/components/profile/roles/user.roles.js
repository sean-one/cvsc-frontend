import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import CreateEventIcon from '../../events/create.event.icon';
import RemoveUserRole from '../../roles/buttons/remove.user.role';

const Styles = styled.div`
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

    .role {
        display: flex;
        justify-content: space-between;
        align-content: flex-end;
        padding: 0.25rem 0.5rem;
        border-radius: 5px;
        border-bottom: 1px solid black;
    }

    .inactiveRole {
        color: gray;
    }
`;

const UserRoles = ({ roles }) => {

    let navigate = useNavigate()
    
    if(roles) { roles.sort((a,b) => b.active_role - a.active_role) }
    
    return (
        <Styles>
            <div className='currentRoles'>

                <div className='currentRolesHeader'>
                    <div>Current Roles</div>
                </div>

                <div>
                    {
                        roles.map(role =>
                            <div key={role.id} className={`role ${(!role.active_role) && 'inactiveRole'}`}>
                                {
                                    (role.active_role) &&
                                        <CreateEventIcon roletype={role.role_type} business_id={role.business_id} />
                                }
                                <div onClick={() => navigate(`/business/${role.business_id}`)} className='text-start flex-fill'>
                                    {role.business_name}
                                </div>
                                <div className='mx-1'>
                                    <RemoveUserRole role_id={role.id} role_type={role.role_type} />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </Styles>
    )
}

export default UserRoles;