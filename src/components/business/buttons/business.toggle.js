import React from 'react';

import { useBusinessToggle } from '../../../hooks/useBusinessApi';

import { ToggleOnIcon, ToggleOffIcon } from '../../icons/siteIcons';


const BusinessToggle = ({ business_id, toggleStatus=false, toggleType }) => {
    const { mutateAsync: toggleBusiness } = useBusinessToggle();
    
    const toggleButtonAction = async () => {
        await toggleBusiness({ toggle_type: { toggleType: toggleType }, business_id: business_id })
    }
    
    return (
        <div onClick={toggleButtonAction}>{(toggleStatus ? <ToggleOnIcon /> : <ToggleOffIcon />)}</div>
    )
}

export default BusinessToggle;