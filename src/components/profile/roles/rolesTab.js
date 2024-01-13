import React from 'react';

import useAuth from '../../../hooks/useAuth';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../../forms/role.request';
import UserRoles from './user.roles';
import LoadingSpinner from '../../loadingSpinner';


const RolesTab = () => {
    const { auth } = useAuth();
    const { data: roles, status } = useUserRolesQuery(auth?.user?.id)
    let userRoles = [];

    if (status === 'loading') {
        return <LoadingSpinner />
    }
    
    userRoles = roles?.data || []


    return (
        <div>
            <RoleRequest user_roles={userRoles} />
            
            {/* current user roles */}
            {
                (userRoles.length > 0) &&
                    <UserRoles roles={userRoles} />
                }
        </div>
    )
}

export default RolesTab;