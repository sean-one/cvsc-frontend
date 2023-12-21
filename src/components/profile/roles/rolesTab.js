import React from 'react';

import useAuth from '../../../hooks/useAuth';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../../forms/role.request';
import UserRoles from './user.roles';
import LoadingSpinner from '../../loadingSpinner';
import ServerReturnError from '../../serverReturnError';


const RolesTab = () => {
    const { auth } = useAuth();
    const { data: roles, status } = useUserRolesQuery(auth?.user?.id)
    let userRoles = [];

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        return <ServerReturnError />
    }
    
    userRoles = roles?.data


    return (
        <div>
            <RoleRequest user_roles={userRoles} />
            
            {/* current user roles */}
            {
                (userRoles.length > 0)
                    ? <UserRoles roles={userRoles} />
                    : <div>no roles to show</div>
                }
        </div>
    )
}

export default RolesTab;