import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

import { useActiveBusinessMutation } from '../../hooks/useBusinessApi';

const BusinessActiveToggle = ({ business_id, isActive }) => {
    const [ activeBusiness, setActiveBusiness ] = useState(isActive)
    const { mutateAsync: toggleActiveBusiness } = useActiveBusinessMutation()

    const toggleActiveStatus = async () => {
        const business_toggled = await toggleActiveBusiness(business_id)

        setActiveBusiness(business_toggled.data.active_business)
    }

    return (
        <div className='d-flex align-items-center justify-content-between pe-4 py-1'>
            <div className={(activeBusiness) ? 'text-secondary' : 'text-danger'}>{'Inactive Business'}</div>
            <FontAwesomeIcon icon={(activeBusiness) ? faToggleOn : faToggleOff} size='lg' onClick={toggleActiveStatus} />
            <div className={(activeBusiness) ? 'text-success' : 'text-secondary'}>{'Active Business'}</div>
        </div>
    )
}

export default BusinessActiveToggle;