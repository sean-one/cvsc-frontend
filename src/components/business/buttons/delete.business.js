import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import { DeleteIcon } from '../../icons/siteIcons';


const DeleteBusiness = ({ business_id }) => {
    let navigate = useNavigate();

    const { mutate: removeBusiness } = useRemoveBusinessMutation();

    const delete_business = () => {
        removeBusiness(business_id)
        navigate('/profile')
    }


    return (
        <div onClick={delete_business}><DeleteIcon /></div>
    )
}

export default DeleteBusiness;