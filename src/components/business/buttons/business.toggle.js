import React from 'react';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa6';

import { useBusinessToggle } from '../../../hooks/useBusinessApi';


const BusinessToggle = ({ business_id, toggleStatus=false, toggleType }) => {
    const { mutate: toggleBusiness } = useBusinessToggle();
    
    const toggleButtonAction = () => {
        toggleBusiness({ toggle_type: { toggleType: toggleType }, business_id: business_id })
    }
    
    return (
        <div onClick={toggleButtonAction}>{(toggleStatus ? <FaToggleOn className='siteIcons' style={{ fontSize: '3.5rem' }} /> : <FaToggleOff className='siteIcons' style={{ color: 'var(--error-color)', fontSize: '3.5rem' }} />)}</div>
    )
}

export default BusinessToggle;