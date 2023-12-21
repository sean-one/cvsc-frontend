import React from 'react';
import styled from 'styled-components';

import RoleAction from './buttons/role.action';
import DeleteRole from './buttons/delete.role';


const BusinessRoleStyles = styled.div``;

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
                <div>{role?.username}</div>
                <div className='roleButtonWrapper'>
                    <RoleAction role_id={role.id} actionType={businessList[list_type]} />
                    <DeleteRole role={role} />   
                </div>
            </div>
        </BusinessRoleStyles>
    )
}

export default BusinessRole;