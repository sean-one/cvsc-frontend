import React from 'react';

import useAuth from '../../../hooks/useAuth';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import CreatorRequest from './creatorRequest';
import UserRoles from '../../roles/user.roles';
import ManagementRoles from '../../roles/management.roles';
import LoadingSpinner from '../../loadingSpinner';

const RolesTab = () => {
    const { auth } = useAuth()
    const { data: roles, isLoading } = useUserRolesQuery(auth.user.id)

    if(isLoading) {
        return <LoadingSpinner />
    }


    return (
        <div>
            <CreatorRequest />
            {
                (roles.data.length > 0) &&
                    <UserRoles user_id={auth.user.id} />
            }
            {
                (auth?.user?.account_type >= 456) &&
                    <ManagementRoles user_id={auth.user.id}/>
            }
        </div>
    )
}

export default RolesTab;