import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../../forms/role.request';
import UserRoles from './user.roles';
import LoadingSpinner from '../../loadingSpinner';


const RolesTab = () => {
    const { auth } = useAuth();
    const { data: user_roles, status: user_roles_status } = useUserRolesQuery(auth?.user?.id)
    let userRoles = [];
    let navigate = useNavigate();

    useEffect(() => {
        if (user_roles_status === 'error') {
            navigate('/profile')
        }

    }, [navigate, user_roles_status])


    if (user_roles_status === 'loading') {
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