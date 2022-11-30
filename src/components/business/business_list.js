import React from 'react';

import useAuth from '../../hooks/useAuth';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';


const BusinessList = ({ business_type }) => {
    const { auth } = useAuth()
    const businessIdList = auth?.roles.map(role => role?.business_id)
    
    const business_type_flip = {
        venue: 'brand',
        brand: 'venue'
    }

    const { data: business_list, isLoading: LoadingBusinessList, isSuccess: BusinessListSuccess } = useBusinessesQuery()

    let business_display_list = []

    if(LoadingBusinessList) {
        return <>loading...</>
    }

    if(BusinessListSuccess) {
        business_display_list = business_list.data.filter(business => business.business_type !== business_type_flip[business_type] && business.active_business)
    }

    return (
        <>
            {
                business_display_list.map(business => (
                    <option key={business.id} value={business.id} style={businessIdList.includes(business.id) ? { color: 'green' } : {}}>{business.business_name}</option>
                ))
            }
        </>
    )
}

export default BusinessList;