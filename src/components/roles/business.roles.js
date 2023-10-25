import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { useBusinessRolesQuery } from '../../hooks/useRolesApi';
import LoadingSpinner from '../loadingSpinner';
import ServerReturnError from '../serverReturnError';
import InactiveRoles from '../roles/inactive.roles';
import PendingRoles from '../roles/pending.roles';
import CreatorRoles from '../roles/creator.roles';
import ManagerRoles from '../roles/manager.roles';


const BusinessRoles = () => {
    const { auth } = useAuth()
    const { dispatch } = useNotification()
    let { business_id } = useParams()
    const { data: business_roles, status, error } = useBusinessRolesQuery(business_id)
    let inactive_roles, pending_roles, creator_roles, manager_roles = []

    let navigate = useNavigate()
    let { pathname } = useLocation()

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (status === 'error') {
        if (error?.response?.status === 401) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })

            navigate('/login', { state: { from: pathname } })

            return null;
        }
        if (error?.response?.status === 400) {
            return <ServerReturnError return_type='business user roles'/>
        } else {
            console.log(error?.response)
            return <ServerReturnError />
        }
    }

    // remove users role from list to avoid incorrect management
    let user_removed_roles = business_roles.data.filter(business_role => business_role.user_id !== auth.user.id)
    // active_role=false & approved_by=user_id
    inactive_roles = user_removed_roles.filter(business_role => !business_role.active_role && business_role.approved_by !== null)
    // active_role=false & approved_by=null
    pending_roles = user_removed_roles.filter(business_role => !business_role.active_role && business_role.approved_by === null)
    creator_roles = user_removed_roles.filter(business_role => (business_role.role_type === process.env.REACT_APP_CREATOR_ACCOUNT && business_role.active_role))
    manager_roles = user_removed_roles.filter(business_role => (business_role.role_type === process.env.REACT_APP_MANAGER_ACCOUNT && business_role.active_role))
    
    
    return (
        <div>
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