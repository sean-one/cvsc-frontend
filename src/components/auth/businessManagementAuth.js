import React, { useEffect } from 'react';
import { useNavigate, useParams } from "react-router";

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { useUserRolesQuery } from "../../hooks/useRolesApi";

const BusinessManagementAuth = ({ children }) => {
    const { auth, user_logout } = useAuth();
    const { dispatch } = useNotification();
    const { business_id } = useParams()
    const { data: user_roles, status: user_roles_status, error: user_roles_error } = useUserRolesQuery(auth?.user?.id)

    let navigate = useNavigate();
    
    useEffect(() => {
        if (user_roles_status === 'error') {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: user_roles_error?.response?.data?.error?.message
                }
            })

            if (user_roles_error?.response?.data?.error?.type === 'token') {
                user_logout()
            } else {
                navigate('/profile')
            }
        }

    }, [dispatch, navigate, user_roles_status, user_roles_error, user_logout])

    if (user_roles_status === 'pending') {
        return (
            <div>loading...</div>
            )
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