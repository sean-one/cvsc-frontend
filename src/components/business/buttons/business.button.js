import React from 'react';
import { useNavigate } from 'react-router-dom';

import { BusinessIcon } from '../../icons/siteIcons';

const BusinessButton = ({ business_id }) => {
    let navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/business/${business_id}`)}>
            <BusinessIcon />
        </div>
    )
}

export default BusinessButton;