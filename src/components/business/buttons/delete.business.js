import React from 'react';

import { useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import { DeleteIcon } from '../../icons/siteIcons';


const DeleteBusiness = ({ business_id, onDeleteStart, onDeleteSuccess }) => {
    const { mutateAsync: removeBusiness } = useRemoveBusinessMutation(onDeleteSuccess);

    const delete_business = async () => {
        onDeleteStart()
        await removeBusiness(business_id)
    }


    return (
        <div onClick={delete_business}><DeleteIcon /></div>
    )
}

export default DeleteBusiness;