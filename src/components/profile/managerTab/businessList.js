import React from 'react';

import BusinessListItem from './businessList_item';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import useAuth from '../../../hooks/useAuth';

const BusinessList = () => {
    const { auth } = useAuth()
    // filter out only management roles
    const management_roles = auth.roles.filter(role => role.role_type >= 456 && role.active_role)
    // create an array of business ids from active 
    const businessIdList = management_roles.map(role => role?.business_id) || []
    const { data: businesses, isLoading } = useBusinessesQuery()

    if(isLoading) {
        return <LoadingSpinner />
    }

    const business_list = businesses.data.filter(business => businessIdList.includes(business.id))


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