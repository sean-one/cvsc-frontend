import React from 'react';

import useAuth from '../../../hooks/useAuth';
import CreatorRequest from './creatorRequest';
import UserRoles from './userRoles';
import ManagementRoles from '../../roles/management.roles';

const RolesTab = () => {
    const { auth } = useAuth()

    return (
        <div>
            <CreatorRequest />
            <UserRoles />
            {
                (auth?.user?.account_type >= 456) &&
                    <ManagementRoles />
            }
        </div>
    )
}

export default RolesTab;