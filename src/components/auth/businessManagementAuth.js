import React, { useEffect } from 'react';
import { useNavigate, useParams } from "react-router";

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { useUserRolesQuery } from "../../hooks/useRolesApi";
import LoadingSpinner from '../loadingSpinner';

const BusinessManagementAuth = ({ children }) => {
    const { auth, user_reset } = useAuth();
    const { dispatch } = useNotification();
    const { business_id } = useParams()
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
    }, [isError, user_roles_error, user_reset, dispatch, navigate])

    if (isPending) {
        return <LoadingSpinner />
    }

    const user_business_role = user_roles?.data.find(role =>
        role.active_role === true &&
        role.business_id === business_id &&
        (role.role_type === 'manager' || role.role_type === 'admin')
    );
    const childWithProps = React.cloneElement(children, { userBusinessRole: user_business_role })


    return (
        <div>
            {user_business_role ? childWithProps : <div>No access</div>}
        </div>
    )
}

export default BusinessManagementAuth;