import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCannabis } from 'react-icons/fa6';


const BusinessButton = ({ business_id }) => {
    let navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/business/${business_id}`)}>
            <FaCannabis className='siteIcons' />
        </div>
    )
}

export default BusinessButton;