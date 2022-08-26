import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

import { useBusinessRequestMutation } from '../../../hooks/useBusinessApi';

const BusinessRequestToggle = ({ business_id, request_open }) => {
    const [ requestOpen, setRequestOpen ] = useState(request_open)
    const { mutateAsync: toggleBusinessRequest } = useBusinessRequestMutation()

    const toggleRequestStatus = async () => {
        const business_toggled = await toggleBusinessRequest(business_id)

        setRequestOpen(business_toggled.data.business_request_open)
    }

    return (
        <div className='d-flex align-items-center justify-content-between pe-4 py-1'>
            <div className={(requestOpen) ? 'text-secondary' : 'text-danger'}>{'Request Disabled'}</div>
            <FontAwesomeIcon icon={(requestOpen) ? faToggleOn : faToggleOff} size='lg' onClick={toggleRequestStatus}/>
            <div className={(requestOpen) ? 'text-success' : 'text-secondary'}>{'Enabled'}</div>
        </div>
    )
}

export default BusinessRequestToggle;