import React from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from '../loadingSpinner';
import { useBusinessQuery } from '../../hooks/useBusinessApi';
import BusinessEditForm from './forms/business.edit.form';

const UpdateBusiness = () => {
    let { business_id } = useParams()
    const { data: business, isLoading } = useBusinessQuery(business_id)

    
    if(isLoading) {
        return <LoadingSpinner />
    }


    return(
        <BusinessEditForm business={business.data} />
    )
}

export default UpdateBusiness;