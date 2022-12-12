import React from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from '../../loadingSpinner';
import { useBusinessQuery } from '../../../hooks/useBusinessApi';
import BusinessForm from '../../forms/business.form';


const EditBusiness = () => {
    let { business_id } = useParams()
    const { data: business, isLoading } = useBusinessQuery(business_id)

    if(isLoading) {
        <LoadingSpinner />
    }

    
    return (
        <BusinessForm business={business.data} />
    )
}

export default EditBusiness;