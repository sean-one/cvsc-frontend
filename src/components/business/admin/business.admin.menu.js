import React from 'react';
import { Button } from 'react-bootstrap';

import { useBusinessRequestToggle } from '../../../hooks/useBusinessApi';

const BusinessAdminMenu = ({ business }) => {
    const { mutateAsync: toggleBusinessRequest } = useBusinessRequestToggle()

    const toggleRequest = async () => {
        const business_toggled = await toggleBusinessRequest(business.id)

        console.log(business_toggled)
    }
    return (
        <div className='d-flex justify-content-between align-items-center bg-light rounded'>
            <Button variant={business.active_business ? 'outline-success' : 'outline-danger'} className='text-center w-100 m-1'>{business.active_business ? 'Active' : 'Inactive'}</Button>
            <Button onClick={toggleRequest} variant={business.business_request_open ? 'outline-success' : 'outline-danger'} className='text-center w-100 m-1'>{business.business_request_open ? 'Request Open' : 'Request Closed'}</Button>
        </div>
    )
}

export default BusinessAdminMenu;