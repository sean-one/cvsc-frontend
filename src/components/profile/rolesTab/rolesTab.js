import React from 'react';

import CreatorRequest from './creatorRequest';
import UserRoles from './userRoles';
import PendingManagementRoles from './pendingManagementRoles';

const RolesTab = () => {

    return (
        <div>
            <CreatorRequest />
            <UserRoles />
            <PendingManagementRoles />
        </div>
    )
}

export default RolesTab;