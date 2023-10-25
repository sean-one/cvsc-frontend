import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../../forms/role.request';
import UserRoles from './user.roles';
import LoadingSpinner from '../../loadingSpinner';


const RolesTab = () => {
    const { auth } = useAuth()
    //! not needed because the user id is pull from the token validation at the endpoint
    const { data: roles, status, error } = useUserRolesQuery(auth?.user?.id)

    const { pathname } = useLocation()
    let navigate = useNavigate()

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        if (error?.response?.status === 401) {

            navigate('/login', { state: { from: pathname } })

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
        </div>
    )
}

export default RolesTab;