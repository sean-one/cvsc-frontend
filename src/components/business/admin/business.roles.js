import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
    const { auth, user_logout } = useAuth();
    const { dispatch } = useNotification();
    let { business_id } = useParams();
    const { data: business_roles, status: business_roles_status, error: business_roles_error } = useBusinessRolesQuery(business_id);

    // let navigate = useNavigate();

    useEffect(() => {
        // 400 - type: 'business_id', 400, 404 - type: 'server', 401, 403 - type: 'token'
        if (business_roles_status === 'error') {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: business_roles_error?.response?.data?.error?.message
                }
            })

            if (business_roles_error?.response?.data?.error?.type === 'token') {
                user_logout()
            }
            // console.log(business_roles_error)
            // navigate('/profile')
        }
    }, [dispatch, business_roles_status, business_roles_error, user_logout])

    if (business_roles_status === 'loading') {
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