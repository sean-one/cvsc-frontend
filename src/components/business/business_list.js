import React from 'react';

import useAuth from '../../hooks/useAuth';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { useUserRolesQuery } from '../../hooks/useRolesApi';
import LoadingSpinner from '../loadingSpinner';


const BusinessList = ({ business_type }) => {
    const { auth } = useAuth()
    let business_display_list = []
    let business_id_list = []
    const { data: roles, isLoading: user_role_loading } = useUserRolesQuery(auth.id)
    const { data: business_list, isLoading: business_list_loading, isSuccess: business_list_success } = useBusinessesQuery()
    
    const business_type_flip = {
        venue: 'brand',
        brand: 'venue'
    }
    
    if(business_list_loading || user_role_loading) {
        return <LoadingSpinner />
    }
    
    if(business_list_success) {
        business_display_list = business_list.data.filter(business => business.business_type !== business_type_flip[business_type] && business.active_business && business.business_request_open)
        business_id_list = roles.data.map(role => role?.business_id)
    }

    return (
        <>
            {
                business_display_list.map(business => (
                    <option key={business.id} value={business.id} style={business_id_list.includes(business.id) ? { color: 'green' } : {}}>{business.business_name}</option>
                ))
            }
        </>
    )
}

export default BusinessList;