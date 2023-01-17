import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis, faTrash } from '@fortawesome/free-solid-svg-icons';


const BrandLabel = ({ brand_id, brand_name, business_role }) => {
    let navigate = useNavigate()


    return (
        <div className='w-100 text-end' onClick={() => navigate(`/business/${brand_id}`)}>
            {brand_name}
            <FontAwesomeIcon icon={(business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT) ? faTrash : faCannabis} className='ms-2' />
        </div>
    )
}

export default BrandLabel;