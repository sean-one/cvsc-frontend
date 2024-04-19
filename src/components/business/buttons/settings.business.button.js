import React from 'react';
import { useNavigate } from 'react-router-dom';

import { TbSettings } from 'react-icons/tb'

const SettingsBusinessButton = ({ business_id }) => {
    let navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/business/admin/${business_id}`)}>
            <TbSettings className='siteIcons' style={{ color: 'var(--main-highlight-color)' }} />
        </div>
    )
}

export default SettingsBusinessButton;