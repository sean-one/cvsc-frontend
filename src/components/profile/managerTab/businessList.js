import React from 'react';

import BusinessListItem from './businessList_item';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import useAuth from '../../../hooks/useAuth';

const BusinessList = () => {
    const { auth } = useAuth()
    let business_list = []
    const { data: user_roles, isLoading: user_roles_loading } = useUserRolesQuery(auth.id)
    const { data: businesses, isLoading: businesses_loading } = useBusinessesQuery()
    
    if(businesses_loading || user_roles_loading) {
        return <LoadingSpinner />
    }
    
    // filter out only management roles
    const management_roles = user_roles?.data.filter(role => role.role_type >= 456 && role.active_role)
    // create an array of business ids from active 
    const businessIdList = management_roles?.map(role => role?.business_id) || []
    
    business_list = businesses.data.filter(business => businessIdList.includes(business.id))


    return (
        <div>
            <h6>Business List</h6>
            {
                business_list.map(business => (
                    <BusinessListItem key={business.id} business={business} />
                ))
            }
        </div>
    )
}

export default BusinessList;