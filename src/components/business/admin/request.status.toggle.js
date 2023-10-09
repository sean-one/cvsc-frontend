import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ToggleOnIcon, ToggleOffIcon } from '../../icons/siteIcons';

import { useBusinessRequestToggle } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const RequestStatusToggle = ({ business_id, isOpen }) => {
    const { mutateAsync: toggleBusinessRequest } = useBusinessRequestToggle()
    let navigate = useNavigate()
    const { dispatch } = useNotification()

    const toggleRequest = async () => {
        try {
            const business_toggled = await toggleBusinessRequest(business_id)
    
            if(business_toggled.status === 201) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${business_toggled.data.business_name} ${business_toggled.data.business_request_open ? 'is now' : 'is no longer'} accepting creator request`
                    }
                })
            }
        } catch (error) {
            if(error?.response?.status === 400 || error?.repsonse?.status === 401) {
                navigate('/login')
                return null
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
            }
        }
    }

    return (
        <div onClick={toggleRequest}>{(isOpen ? <ToggleOnIcon /> : <ToggleOffIcon />)}</div>
    )
}

export default RequestStatusToggle;