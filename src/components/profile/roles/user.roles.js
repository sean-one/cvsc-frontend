import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import CreateEventIcon from '../../events/create.event.icon';
import RemoveUserRole from '../../roles/buttons/remove.user.role';

const Styles = styled.div`
    .currentRoles {
        padding-bottom: 1.5rem;
        /* border: 2px solid red; */
    }

    .currentRolesHeader {
        display: flex;
        justify-content: space-between;
        align-content: center;
        border-bottom: 1px solid black;
    }
    
    .roletypes {
        margin: 0 0.5rem;
        display: flex;
        align-self: flex-end;
        font-size: 10px;
        gap: 10px;
    }

    .role {
        display: flex;
        justify-content: space-between;
        align-content: flex-end;
        padding: 0.25rem 0.5rem;
        border-bottom: 1px solid black;
    }

    .inactiveRole {
        color: gray;
    }
`;

const UserRoles = ({ roles }) => {

    let navigate = useNavigate()
    
    if(roles) {
        roles.sort((a,b) => b.active_role - a.active_role)
    }

    
    return (
        <Styles>
            <div className='currentRoles'>
                <div className='currentRolesHeader'>
                    <div>Current Roles</div>
                    <div className='roletypes'>
                        <div>admin</div>
                        <div>manager</div>
                        <div>creator</div>
                    </div>
                </div>
                <div>
                    {
                        roles.map(role =>
                            <div key={role.id} className={`role ${(!role.active_role) && 'inactiveRole'}`}>
                                <CreateEventIcon roletype={role.role_type} business_id={role.business_id} />
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