import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import CreateEventButton from '../events/create.event.button';
import DeleteRole from './buttons/delete.role';

const UserRoleStyles = styled.div`
    .userRoleBusinessName {
        color: var(--main-highlight-color);
    }
`;

const UserRole = ({ role }) => {
    let navigate = useNavigate();


    return (
        <UserRoleStyles>
            <div className='roleWrapper'>
                <div className='userRoleBusinessName' onClick={() => navigate(`/business/${role?.business_id}`)}>{role?.business_name}</div>
                <div className='roleButtonWrapper'>
                    {
                        (role?.active_role) &&
                            <CreateEventButton />
                    }
                    {
                        (role?.role_type !== 'admin') &&
                            <DeleteRole role={role} />
                    }
                </div>
            </div>
        </UserRoleStyles>    
    )
}

export default UserRole;