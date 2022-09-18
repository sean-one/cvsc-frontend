import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis } from '@fortawesome/free-solid-svg-icons';


const BusinessBrand = ({ brand_id, brand_name }) => {
    return (
        <div className='d-flex align-items-center py-1'>
            <FontAwesomeIcon icon={faCannabis} className='me-2' />
            <Link to={{ pathname: `/business/${brand_id}`}}>{brand_name}</Link>
        </div>
    )
}

export default BusinessBrand;