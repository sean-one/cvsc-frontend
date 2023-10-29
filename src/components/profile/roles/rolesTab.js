import React from 'react';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../../forms/role.request';
import UserRoles from './user.roles';
import LoadingSpinner from '../../loadingSpinner';


const RolesTab = () => {
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    //! not needed because the user id is pull from the token validation at the endpoint
    const { data: roles, status, error } = useUserRolesQuery(auth?.user?.id)

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: error?.response?.data?.error?.message
            }
        })
        return null
    }

    
    return (
        <div>
            <RoleRequest />
            
            {/* current user roles */}
            { (roles.data.length > 0) && <UserRoles roles={roles.data} /> }
        </div>
    )
}

export default RolesTab;