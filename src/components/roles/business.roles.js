import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useBusinessRolesQuery } from '../../hooks/useRolesApi';
import LoadingSpinner from '../loadingSpinner';
import InactiveRoles from '../roles/inactive.roles';
import PendingRoles from '../roles/pending.roles';
import CreatorRoles from '../roles/creator.roles';
import ManagerRoles from '../roles/manager.roles';


const BusinessRoles = () => {
    let { business_id } = useParams()
    const { data: business_roles, isLoading, isSuccess } = useBusinessRolesQuery(business_id)
    let inactive_roles, pending_roles, creator_roles, manager_roles = []

    let navigate = useNavigate()

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isSuccess) {
        inactive_roles = business_roles.data.filter(business_role => !business_role.active_role && business_role.approved_by !== null)
        pending_roles = business_roles.data.filter(business_role => !business_role.active_role && business_role.approved_by === null)
        creator_roles = business_roles.data.filter(business_role => (business_role.role_type === '123' && business_role.active_role))
        manager_roles = business_roles.data.filter(business_role => (business_role.role_type === '456' && business_role.active_role))
    }

    
    return (
        <div>
            <div className='mb-3' onClick={() => navigate(-1)}>{`< back`}</div>
            {
                (inactive_roles.length > 0) &&
                    <InactiveRoles roles_list={inactive_roles} />
            }
            {
                (pending_roles.length > 0 && inactive_roles.length === 0) &&
                    <PendingRoles roles_list={pending_roles} />
            }
            {
                (creator_roles.length > 0 && inactive_roles.length === 0) &&
                    <CreatorRoles roles_list={creator_roles} />
            }
            {
                (manager_roles.length > 0 && inactive_roles.length === 0) &&
                    <ManagerRoles roles_list={manager_roles} />
            }
        </div>
    )
}

export default BusinessRoles;