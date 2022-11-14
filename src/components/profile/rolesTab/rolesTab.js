import React from 'react';

import CreatorRequest from './creatorRequest';
import UserRoles from './userRoles';
import PendingManagementRoles from './pendingManagementRoles';

const RolesTab = () => {
    const user_id = localStorage.getItem('user')

    return (
        <div>
            <CreatorRequest />
            <UserRoles />
            <PendingManagementRoles user_id={user_id}/>
        </div>
    )
}

export default RolesTab;