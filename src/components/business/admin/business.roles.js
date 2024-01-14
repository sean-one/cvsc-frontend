import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
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
        creator: user_removed_roles.filter(role => role.role_type === process.env.REACT_APP_CREATOR_ACCOUNT && role.active_role),
        manager: user_removed_roles.filter(role => role.role_type === process.env.REACT_APP_MANAGER_ACCOUNT && role.active_role),
    }
}


const BusinessRoles = () => {
    const { auth } = useAuth();
    let { business_id } = useParams();
    const { data: business_roles, status: business_roles_status } = useBusinessRolesQuery(business_id);

    let navigate = useNavigate();

    useEffect(() => {
        if (business_roles_status === 'error') {
            navigate('/profile')
        }
    }, [navigate, business_roles_status])

    if (business_roles_status === 'loading') {
        return <LoadingSpinner />
    }

    const { inactive, pending, creator, manager } = filterRoles(business_roles?.data, auth.user.id)
    

    return (
        <div>
            {(inactive.length > 0) && <InactiveRoles roles_list={inactive} />}
            {(pending.length > 0) && <PendingRoles roles_list={pending} />}
            {(creator.length > 0) && <CreatorRoles roles_list={creator} />}
            {(manager.length > 0) && <ManagerRoles roles_list={manager} />}
        </div>
    )
}

export default BusinessRoles;