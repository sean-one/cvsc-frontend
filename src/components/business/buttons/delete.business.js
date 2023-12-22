import React from 'react';

import { useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import { DeleteIcon } from '../../icons/siteIcons';


const DeleteBusiness = ({ business_id }) => {
    const { mutateAsync: removeBusiness } = useRemoveBusinessMutation()

    const delete_business = async () => {
        await removeBusiness(business_id)
    }


    return (
        <div onClick={delete_business}><DeleteIcon /></div>
    )
}

export default DeleteBusiness;