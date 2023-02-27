import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { role_types } from '../../../helpers/dataCleanUp';
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

    .singleRole {

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
                </div>
                <div>
                    {
                        roles.map(role =>
                            <div key={role.id} className={`d-flex justify-content-between align-items-end ps-2 pb-1 border-bottom rounded-bottom ${role.active_role ? '' : 'text-danger'}`}>
                                <div className='me-2'>
                                    {role_types[role.role_type].charAt().toUpperCase()}
                                </div>
                                <div onClick={() => navigate(`/business/${role.business_id}`)} className='text-start flex-fill'>
                                    {role.business_name}
                                </div>
                                <div onClick={() => navigate('/event/create', { state: role.business_id })}>+</div>
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