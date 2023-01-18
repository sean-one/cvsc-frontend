import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis, faTrash } from '@fortawesome/free-solid-svg-icons';


const BrandLabel = ({ brand_id, brand_name, business_role }) => {
    let navigate = useNavigate()

    const remove_business = () => {
        console.log('click')
    }

    
    return (
        <div className='d-flex justify-content-end align-items-center w-100 text-end'>
            <div onClick={() => navigate(`/business/${brand_id}`)}>{brand_name}</div>
            {
                (business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT)
                    ? <FontAwesomeIcon onClick={remove_business} icon={faTrash} className='ms-2' />
                    : <FontAwesomeIcon onClick={() => navigate(`/business/${brand_id}`)} icon={faCannabis} className='ms-2' />
            }
        </div>
    )
}

export default BrandLabel;