import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { useBusinessRequestToggle, useActiveBusinessToggle } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const BusinessAdminMenu = ({ business, business_role }) => {
    const { mutateAsync: toggleBusinessRequest } = useBusinessRequestToggle()
    const { mutateAsync: toggleActiveBusiness } = useActiveBusinessToggle()

    let navigate = useNavigate()
    const { dispatch } = useNotification()
    
    const toggleRequest = async () => {
        const business_toggled = await toggleBusinessRequest(business.id)

        if(business_toggled.status === 201) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${business_toggled.data.business_name} ${business_toggled.data.business_request_open ? 'is now' : 'is no longer'} accepting creator request`
                }
            })
        } else {
            console.log('incorrect return')
        }
    }

    const toggleActive = async () => {
        const active_toggle = await toggleActiveBusiness(business.id)

        if(active_toggle.status === 201) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${active_toggle.data.business_name} has been updated to ${active_toggle.data.active_business ? 'active' : 'inactive'}`
                }
            })
        }
        console.log(active_toggle)
    }


    return (
        <div className='d-flex justify-content-between align-items-center bg-light rounded'>
            <Button onClick={() => navigate(`/business/roles/${business.id}`)} variant='outline-dark' className='text-center flex-fill m-1'>Roles</Button>
            {
                (business_role > 456) &&
                    <Button onClick={toggleActive} variant={business.active_business ? 'outline-success' : 'outline-danger'} className='text-center flex-fill m-1'>{business.active_business ? 'Active' : 'Inactive'}</Button>
            }
            <Button onClick={toggleRequest} variant={business.business_request_open ? 'outline-success' : 'outline-danger'} className='text-center flex-fill m-1'>{business.business_request_open ? 'Request Open' : 'Request Closed'}</Button>
        </div>
    )
}

export default BusinessAdminMenu;