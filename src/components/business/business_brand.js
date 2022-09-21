import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis } from '@fortawesome/free-solid-svg-icons';


const BusinessBrand = ({ brand_id, brand_name, reverse }) => {

    return (
        <Link to={{ pathname: `/business/${brand_id}` }} className={`d-flex align-items-center py-1 w-100 ${(reverse) ? 'justify-content-end' : ''}`}>
            <FontAwesomeIcon icon={faCannabis} className={reverse ? 'ms-2' : 'me-2'} />
            <div className={reverse ? 'order-first' : ''}>{brand_name}</div>
        </Link>
    )
}

export default BusinessBrand;