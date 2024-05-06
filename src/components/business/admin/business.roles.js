import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useBusinessRolesQuery } from '../../../hooks/useRolesApi';
import LoadingSpinner from '../../loadingSpinner';
import InactiveRoles from './rolesList/inactive.roles';
import PendingRoles from './rolesList/pending.roles';
import CreatorRoles from './rolesList/creator.roles';
import ManagerRoles from './rolesList/manager.roles';

const filterRoles = (roles, user_id) => {
    if (roles === undefined) { roles = [] }
    const user_removed_roles = roles.filter(role => role.user_id !== user_id);

    return {
        inactive: user_removed_roles.filter(role => !role.active_role && role.approved_by !== null),
        pending: user_removed_roles.filter(role => !role.active_role && role.approved_by === null),
        creator: user_removed_roles.filter(role => role.role_type === 'creator' && role.active_role),
        manager: user_removed_roles.filter(role => role.role_type === 'manager' && role.active_role),
    }
}

// inside business.admin.view
const BusinessRoles = () => {
    const { auth, user_reset } = useAuth();
    const { dispatch } = useNotification();
    let { business_id } = useParams();
    const { data: business_roles, isPending, isError, error: business_roles_error } = useBusinessRolesQuery(business_id);

    let navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            // 401, 403 - type: 'token', 'server'
            if (business_roles_error?.response?.status === 403 || business_roles_error?.response?.status === 401) {
                // remove expired or bad token and reset user
                user_reset()
                
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: business_roles_error?.response?.data?.error?.message
                    }
                })
    
                navigate('/login')
            } else {
                // 400 - type: 'business_id', 'server' 
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: business_roles_error?.response?.data?.error?.message
                    }
                })
    
                navigate('/profile')
            }
        }
    }, [isError, business_roles_error, user_reset, dispatch, navigate])

    if (isPending) {
        return <LoadingSpinner />
    }

    const { inactive, pending, creator, manager } = filterRoles(business_roles?.data, auth.user.id)
    

    return (
        <div>
            {/* roles that HAVE been approved - HOWEVER active_role is set to FALSE */}
            {(inactive.length > 0) && <InactiveRoles roles_list={inactive} />}
            {/* roles that HAVE NOT been approved yet */}
            {(pending.length > 0) && <PendingRoles roles_list={pending} />}
            {/* APPROVED CREATOR roles */}
            {(creator.length > 0) && <CreatorRoles roles_list={creator} />}
            {/* APPROVED MANAGER roles */}
            {(manager.length > 0) && <ManagerRoles roles_list={manager} />}
        </div>
    )
}

export default BusinessRoles;