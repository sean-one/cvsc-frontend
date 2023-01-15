import React from 'react';

import useAuth from '../../../hooks/useAuth';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../forms/role.request';
import UserRoles from './user.roles';
import PendingRoleRequest from './pending.role.request';
import LoadingSpinner from '../../loadingSpinner';

const RolesTab = () => {
    const { auth } = useAuth()
    const { data: roles, isLoading } = useUserRolesQuery(auth.user.id)

    if(isLoading) {
        return <LoadingSpinner />
    }


    return (
        <div>
            <RoleRequest />
            {
                (roles.data.length > 0) &&
                    <UserRoles roles={roles.data} />
            }
            {
                (auth?.user?.account_type >= process.env.REACT_APP_MANAGER_ACCOUNT) &&
                    <PendingRoleRequest user_id={auth.user.id}/>
            }
        </div>
    )
}

export default RolesTab;