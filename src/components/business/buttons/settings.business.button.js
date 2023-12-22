import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SettingsIcon } from '../../icons/siteIcons';

const SettingsBusinessButton = ({ business_id }) => {
    let navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/business/admin/${business_id}`)}>
            <SettingsIcon />
        </div>
    )
}

export default SettingsBusinessButton;