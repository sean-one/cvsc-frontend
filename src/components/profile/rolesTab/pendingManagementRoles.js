import React from 'react';

import { usePendingRolesQuery } from '../../../hooks/useBusinessApi';
import LoadingSpinner from '../../loadingSpinner';
import sortPendingByBusiness from '../../../helpers/sortPendingByBusiness';
import RolesList from '../../roles/rolesList';

const PendingManagementRoles = () => {
    const { data: pending_roles, isLoading, isSuccess } = usePendingRolesQuery()
    let sortedByBusiness = {}

    if(isLoading) {
        return <LoadingSpinner />
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
                        <RolesList roles_list={sortedByBusiness[key]} list_type='pending' />
                    </div>
                ))
            }
        </div>
    )
}

export default PendingManagementRoles;