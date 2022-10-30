import React, { useContext } from 'react';

import { UsersContext } from '../../context/users/users.provider';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';

import LoadingSpinner from '../loadingSpinner';

const BusinessList = ({ business_type }) => {
    const { userActiveRoles } = useContext(UsersContext)
    const business_roles = userActiveRoles()
    const business_type_flip = {
        venue: 'brand',
        brand: 'venue'
    }

    const { data: business_list, isLoading: LoadingBusinessList, isSuccess: BusinessListSuccess } = useBusinessesQuery()

    let business_display_list = []

    if(LoadingBusinessList) {
        return <LoadingSpinner />
    }

    if(BusinessListSuccess) {
        business_display_list = business_list.data.filter(business => business.business_type !== business_type_flip[business_type] && business.active_business)
    }

    return (
        <>
            {
                business_display_list.map(business => (
                    <option key={business.id} value={business.id} style={business_roles.includes(business.id) ? { color: 'green' } : {}}>{business.business_name}</option>
                ))
            }
        </>
    )
}

export default BusinessList;