import React from 'react';

import { useBusinessToggle } from '../../../hooks/useBusinessApi';

import { ToggleOnIcon, ToggleOffIcon } from '../../icons/siteIcons';


const BusinessToggle = ({ business_id, toggleStatus=false, toggleType }) => {
    const { mutate: toggleBusiness } = useBusinessToggle();
    
    const toggleButtonAction = () => {
        toggleBusiness({ toggle_type: { toggleType: toggleType }, business_id: business_id })
    }
    
    return (
        <div onClick={toggleButtonAction}>{(toggleStatus ? <ToggleOnIcon /> : <ToggleOffIcon />)}</div>
    )
}

export default BusinessToggle;