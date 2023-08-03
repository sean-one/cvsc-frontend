import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import RemoveUserRole from './buttons/remove.user.role';

const RoleStyles = styled.div`
    .roleWrapper {
        margin: 0.5rem 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .roleButtonWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 10px;
    }
`;

const Role = ({ role }) => {
    
    let navigate = useNavigate()


    return (
        <RoleStyles>
            <div className='roleWrapper'>
                <div>{role.business_name}</div>
                <div className='roleButtonWrapper'>
                    <button disabled={!role.active_role} onClick={() => navigate('/event/create', { state: role.business_id })}>create</button>
                    <RemoveUserRole role={role} />
                </div>
            </div>
        </RoleStyles>
    )
}

export default Role;