import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../../forms/role.request';
import UserRoles from './user.roles';
import LoadingSpinner from '../../loadingSpinner';


const RolesTab = () => {
    const { auth, user_reset } = useAuth();
    const { dispatch } = useNotification();
    const { data: user_roles, isPending, isError, error: user_roles_error } = useUserRolesQuery(auth?.user?.id)
    
    let navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            if (user_roles_error?.response?.status === 401 || user_roles_error?.response?.data?.error?.type === 'token') {
                // remove expired or bad token and reset user
                user_reset()

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: user_roles_error?.response?.data?.error?.message
                    }
                })

                navigate('/login')
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: user_roles_error?.response?.data?.error?.message
                    }
                })
    
                navigate('/profile')

            }
        }

    }, [dispatch, navigate, isError, user_roles_error, user_reset])
    

    return (
        <div>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : (
                    <div>
                        <RoleRequest user_roles={user_roles?.data} />
                        
                        {/* current user roles */}
                        {
                            (user_roles?.data?.length > 0) &&
                                <UserRoles roles={user_roles?.data} />
                        }
                    </div>
                )
            }
        </div>
    )
}

export default RolesTab;