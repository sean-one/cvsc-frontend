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
        <div className='d-flex align-items-center'>
            {`${(activeBusiness) ? 'deactivate' : 'active'} business`}
            <FontAwesomeIcon icon={(activeBusiness) ? faToggleOn : faToggleOff} size='lg' onClick={toggleActiveStatus} />
        </div>
    )
}

export default BusinessActiveToggle;