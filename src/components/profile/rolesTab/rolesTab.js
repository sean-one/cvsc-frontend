import React from 'react';
import { useParams } from 'react-router-dom';

import CreatorRequest from './creatorRequest';
import UserRoles from './userRoles';
import PendingManagementRoles from './pendingManagementRoles';

const RolesTab = () => {
    const { user_id } = useParams()

    console.log(`user id from params: ${user_id}`)
    return (
        <div>
            <CreatorRequest />
            <UserRoles />
            <PendingManagementRoles user_id={user_id || localStorage.getItem('user')}/>
        </div>
    )
}

export default RolesTab;