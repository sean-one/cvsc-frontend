import React, { useContext } from 'react';

import BusinessListItem from './businessList_item';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import { UsersContext } from '../../../context/users/users.provider';

const BusinessList = () => {
    const { data: businesses, isLoading } = useBusinessesQuery()
    const { useRoleBuinsessIds_Management } = useContext(UsersContext)
    const business_ids = useRoleBuinsessIds_Management()

    if(isLoading) {
        return <div>loading...</div>
    }

    const business_list = businesses.data.filter(business => business_ids.includes(business.id))

    return (
        <div className='border border-light'>
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