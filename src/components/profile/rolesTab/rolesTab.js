import React from 'react';

import CreatorRequest from '../basicSection/creatorRequest';
import UserRoles from '../basicSection/userRoles';
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