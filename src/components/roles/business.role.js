import React from 'react';
import styled from 'styled-components';

import RoleAction from './buttons/role.action';
import DeleteRole from './buttons/delete.role';


const BusinessRoleStyles = styled.div`
    .businessRoleUsername {
        color: var(--main-highlight-color);
    }

    .roleButtonWrapper {
        gap: 1.5rem;
    }
`;

const BusinessRole = ({ role, list_type }) => {
    const businessList = {
        inactive: 'inactive',
        pending: 'approve',
        creator: 'upgrade',
        manager: 'downgrade'
    }

    return (
        <BusinessRoleStyles>
            <div className='roleWrapper'>
                <div className='businessRoleUsername'>{role?.username}</div>
                <div className='roleButtonWrapper'>
                    <RoleAction role_id={role.id} actionType={businessList[list_type]} />
                    <DeleteRole role={role} />   
                </div>
            </div>
        </BusinessRoleStyles>
    )
}

export default BusinessRole;