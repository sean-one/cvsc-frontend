import React from 'react';

import useAuth from '../../../hooks/useAuth';
import CreatorRequest from './creatorRequest';
import UserRoles from './userRoles';
import PendingManagementRoles from './pendingManagementRoles';

const RolesTab = () => {
    const { auth } = useAuth()

    return (
        <div>
            <CreatorRequest />
            <UserRoles />
            {
                (auth?.user?.account_type >= 456) &&
                    <PendingManagementRoles />
            }
        </div>
    )
}

export default RolesTab;