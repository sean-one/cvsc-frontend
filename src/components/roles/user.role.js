import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import CreateEventButton from '../events/create.event.button';
import DeleteRole from './buttons/delete.role';

const UserRoleStyles = styled.div``;

const UserRole = ({ role }) => {
    let navigate = useNavigate();


    return (
        <UserRoleStyles>
            <div className='roleWrapper'>
                <div onClick={() => navigate(`/business/${role?.business_id}`)}>{role?.business_name}</div>
                <div className='roleButtonWrapper'>
                    {/* {
                        (role?.active_role) &&
                            <CreateEventButton business_id={role?.business_id} />
                    } */}
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