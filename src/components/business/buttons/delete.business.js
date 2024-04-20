import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashCan } from 'react-icons/fa6';

import { useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';


const DeleteBusiness = ({ business_id }) => {
    let navigate = useNavigate();

    const { mutate: removeBusiness } = useRemoveBusinessMutation();

    const delete_business = () => {
        removeBusiness(business_id)
        navigate('/profile')
    }


    return (
        <div onClick={delete_business}><FaTrashCan className='siteIcons' style={{ color: 'var(--error-color)' }} /></div>
    )
}

export default DeleteBusiness;