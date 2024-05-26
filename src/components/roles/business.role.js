import React from 'react';
import styled from 'styled-components';

import RoleAction from './buttons/role.action';
import DeleteRole from './buttons/delete.role';


const BusinessRoleStyles = styled.div`
    .roleWrapper {
        width: 100%;
        padding: 0.75rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px dotted var(--text-color);
        border-bottom: 1px dotted var(--text-color);
        gap: 1rem;
    }

    .businessRoleUsername {
        color: var(--main-highlight-color);
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        white-space: nowrap;
        max-width: 60%;
    }

    .roleButtonWrapper {
        display: flex;
        gap: 0.75rem;
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