import React, { useContext } from 'react';

import BusinessListItem from './businessList_item';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import { UsersContext } from '../../../context/users/users.provider';

const BusinessList = () => {
    const { data: businesses, isLoading } = useBusinessesQuery()
    const { userRolesBuinsessManagementIds } = useContext(UsersContext)
    const business_ids = userRolesBuinsessManagementIds()

    if(isLoading) {
        return <LoadingSpinner />
    }

    const business_list = businesses.data.filter(business => business_ids.includes(business.id))

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