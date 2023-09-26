import React from 'react';
import { useNavigate } from 'react-router-dom';

import ManagementListItem from './management.list.item';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import useAuth from '../../../hooks/useAuth';

const ManagementList = () => {
    const { auth, logout_user } = useAuth()
    let business_list = []
    let navigate = useNavigate()

    const { data: businesses, isLoading, isSuccess, isError } = useBusinessesQuery()

    if (isLoading) {
        return <LoadingSpinner />
    }

    if(isSuccess) {
        const manager_roles = auth?.roles.filter(role => role.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && role.active_role).map(role => role.business_id)
        business_list = businesses.data.filter(business => manager_roles.includes(business.id))
    }

    if(isError) {
        logout_user()
        navigate('/login')
        return false
    }


    return (
        <div>
            {
                business_list.map(business => (
                    <ManagementListItem key={business.id} business={business} />
                ))
            }
        </div>
    )
}

export default ManagementList;