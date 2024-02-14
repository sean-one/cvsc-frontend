import React from 'react';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';

import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';

import BusinessesViewCard from './businesses.view.card';


const BusinessesView = () => {
    const { dispatch } = useNotification();
    const { data: businesses_list, isPending, isError, error: businesses_list_error } = useBusinessesQuery();

    if (isError) {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: businesses_list_error?.response?.data?.error?.message
            }
        })
    }
    
    return (
        <div>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : (
                    <div>
                        {
                            businesses_list?.data?.map(business => {
                                return (
                                    <BusinessesViewCard keu={business.id} business={business} />
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

export default BusinessesView;