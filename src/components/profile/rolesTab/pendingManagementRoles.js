import React from 'react';

import { usePendingRolesQuery } from '../../../hooks/useBusinessApi';
import sortPendingByBusiness from '../../../helpers/sortPendingByBusiness';
import PendingRoleList from '../../business/management/businessUserRoles/pendingRoleList';

const PendingManagementRoles = () => {
    const { data: pending_roles, isLoading, isSuccess } = usePendingRolesQuery()
    let sortedByBusiness = {}

    if(isLoading) {
        return <div>loading...</div>
    }

    if(isSuccess) {
        sortedByBusiness = sortPendingByBusiness(pending_roles.data)
    }

    return (
        <div>
            {
                ((Object.keys(sortedByBusiness).length) !== 0) &&
                    <h6>Pending Business Request</h6>
            }
            {
                Object.keys(sortedByBusiness).map(key => (
                    <div key={sortedByBusiness[key][0].business_id}>
                        <div>{key}</div>
                        <PendingRoleList pending_roles={sortedByBusiness[key]} />
                    </div>
                ))
            }
        </div>
    )
}

export default PendingManagementRoles;