import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { useBusinessRequestToggle, useActiveBusinessToggle, useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const BusinessAdminMenu = ({ business, business_role }) => {
    const { mutateAsync: toggleBusinessRequest } = useBusinessRequestToggle()
    const { mutateAsync: toggleActiveBusiness } = useActiveBusinessToggle()
    const { mutateAsync: removeBusiness } = useRemoveBusinessMutation()

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
    }

    const delete_business = async () => {
        const deleted_business = await removeBusiness(business.id)

        if(deleted_business.status === 204) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${business.business_name} has been deleted`
                }
            })

            navigate(-1)
        }

    }


    return (
        <div>
            <div className='d-flex justify-content-between align-items-center bg-light rounded'>
                <Button onClick={() => navigate(`/business/roles/${business.id}`)} variant='outline-dark' className='text-center flex-fill m-1'>Roles</Button>
                {
                    (business_role > process.env.REACT_APP_MANAGER_ACCOUNT) &&
                        <Button onClick={toggleActive} variant={business.active_business ? 'outline-success' : 'outline-danger'} className='text-center flex-fill m-1'>{business.active_business ? 'Active' : 'Inactive'}</Button>
                }
                <Button onClick={toggleRequest} variant={business.business_request_open ? 'outline-success' : 'outline-danger'} className='text-center flex-fill m-1'>{business.business_request_open ? 'Request Open' : 'Request Closed'}</Button>
                {
                    (business_role > process.env.REACT_APP_MANAGER_ACCOUNT) &&
                        <Button onClick={delete_business} variant='outline-danger' className='text-center flex-fill m-1'>delete</Button>
                }
            </div>
            <div className={`w-100 bg-danger rounded text-light my-1 ${(business.active_business) ? 'd-none' : ''}`}>* Business is inactive / does not show in search</div>
            <div className={`w-100 bg-danger rounded text-light my-1 ${(business.business_request_open) ? 'd-none' : ''}`}>* Business currently not accepting 'Creator' request</div>
        </div>
    )
}

export default BusinessAdminMenu;