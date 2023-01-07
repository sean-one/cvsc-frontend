import React from 'react';
import { useNavigate } from 'react-router-dom';

import BusinessListItem from './businessList_item';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';

const BusinessList = () => {
    const { auth } = useAuth()
    const { dispatch } = useNotification()
    let business_list = []
    const { data: user_roles, isLoading: user_roles_loading, isError, error } = useUserRolesQuery(auth.id)
    const { data: businesses, isLoading: businesses_loading } = useBusinessesQuery()
    
    let navigate = useNavigate()

    if(businesses_loading || user_roles_loading) {
        return <LoadingSpinner />
    }
    
    if((isError) && (error?.response.status === 401)) {
        
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: `${error?.response.data.error.message}`
            }
        })

        navigate('/login')
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