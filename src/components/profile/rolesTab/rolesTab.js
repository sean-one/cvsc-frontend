import React from 'react';

import CreatorRequest from './creatorRequest';
import UserRoles from './userRoles';
import PendingManagementRoles from './pendingManagementRoles';

const RolesTab = ({ user_id }) => {
    console.groupCollapsed(user_id)
    return (
        <div>
            <CreatorRequest />
            <UserRoles />
            <PendingManagementRoles user_id={user_id}/>
        </div>
    )
}

export default RolesTab;