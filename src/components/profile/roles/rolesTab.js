import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../../forms/role.request';
import UserRoles from './user.roles';
import LoadingSpinner from '../../loadingSpinner';


const RolesTab = () => {
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    const { data: user_roles, status: user_roles_status, error: user_roles_error } = useUserRolesQuery(auth?.user?.id)
    
    let navigate = useNavigate();
    let userRoles = [];

    useEffect(() => {
        if (user_roles_status === 'error') {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: user_roles_error?.response?.data?.error?.message
                }
            })

            navigate('/profile')
        }

    }, [dispatch, navigate, user_roles_status, user_roles_error])


    if (user_roles_status === 'pending') {
        return <LoadingSpinner />
    }
    
    userRoles = user_roles?.data || []


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