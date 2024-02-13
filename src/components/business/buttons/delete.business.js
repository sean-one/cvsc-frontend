import React from 'react';

import { useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import { DeleteIcon } from '../../icons/siteIcons';


const DeleteBusiness = ({ business_id }) => {
    const { mutate: removeBusiness } = useRemoveBusinessMutation();

    const delete_business = () => {
        removeBusiness(business_id)
    }


    return (
        <div onClick={delete_business}><DeleteIcon /></div>
    )
}

export default DeleteBusiness;