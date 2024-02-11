import React from 'react';

import { useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import { DeleteIcon } from '../../icons/siteIcons';


const DeleteBusiness = ({ business_id, onDeleteStart, onDeleteSuccess }) => {
    const { mutate: removeBusiness } = useRemoveBusinessMutation(onDeleteSuccess);

    const delete_business = () => {
        onDeleteStart()
        removeBusiness(business_id)
    }


    return (
        <div onClick={delete_business}><DeleteIcon /></div>
    )
}

export default DeleteBusiness;