import React, { useEffect } from 'react';
import { useNavigate, useParams } from "react-router";

import useAuth from '../../hooks/useAuth';
import { useUserRolesQuery } from "../../hooks/useRolesApi";

const BusinessManagementAuth = ({ children }) => {
    const { auth } = useAuth();
    const { business_id } = useParams()
    const { data: user_roles, status: user_roles_status } = useUserRolesQuery(auth?.user?.id)

    let navigate = useNavigate();
    
    useEffect(() => {
        if (user_roles_status === 'error') {
            navigate('/profile')
        }

    }, [navigate, user_roles_status])

    if (user_roles_status === 'loading') {
        return (
            <div>loading...</div>
            )
    }

    const user_business_role = user_roles?.data.find(role => role.business_id === business_id && role.role_type >= 456 && role.active_role === true)
    const childWithProps = React.cloneElement(children, { userBusinessRole: user_business_role })


    return (
        <div>
            {user_business_role ? childWithProps : <div>No access</div>}
        </div>
    )
}

export default BusinessManagementAuth;