import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../../forms/role.request';
import UserRoles from './user.roles';
import ManagementRolesTab from './management.roles.tab';
import LoadingSpinner from '../../loadingSpinner';


const RolesTab = () => {
    const { auth, logout_user } = useAuth()
    const { data: roles, isLoading, isError, error } = useUserRolesQuery(auth.user.id)

    let navigate = useNavigate()

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isError) {
        if((error.response.status === 400) || (error.response.status === 401)) {
            logout_user()

            navigate('/login')

            return false
        } else {
            navigate('/')
            return false
        }
    }

    
    return (
        <div>
            <RoleRequest />
            
            {/* current user roles */}
            { (roles.data.length > 0) && <UserRoles roles={roles.data} /> }
            
            {/* pending roles for businesses managed */}
            { (auth?.user?.account_type >= process.env.REACT_APP_MANAGER_ACCOUNT) &&
                <ManagementRolesTab user_id={auth.user_id} />
            }
        </div>
    )
}

export default RolesTab;