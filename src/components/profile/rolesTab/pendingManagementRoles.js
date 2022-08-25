import React from 'react';

import { usePendingRolesQuery } from '../../../hooks/useBusinessApi';
import PendingRoleList from '../../business/management/businessUserRoles/pendingRoleList';

const PendingManagementRoles = () => {
    const { data: pending_roles, isLoading } = usePendingRolesQuery()

    if(isLoading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <PendingRoleList pending_roles={pending_roles.data} />
        </div>
    )
}

export default PendingManagementRoles;