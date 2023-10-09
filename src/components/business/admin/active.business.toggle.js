import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ToggleOnIcon, ToggleOffIcon } from '../../icons/siteIcons';
import { useActiveBusinessToggle } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const ActiveBusinessToggle = ({ business_id, isActive }) => {
    const { dispatch } = useNotification()
    const { mutateAsync: toggleActiveBusiness } = useActiveBusinessToggle()

    let navigate = useNavigate()

    const toggleActive = async () => {
        try {
            const active_toggle = await toggleActiveBusiness(business_id)
    
            if(active_toggle.status === 201) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${active_toggle.data.business_name} has been updated to ${active_toggle.data.active_business ? 'active' : 'inactive' }`
                    }
                })
            }
        } catch (error) {
            if(error.response?.status === 400 || error.response?.status === 401) {
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
        <div onClick={toggleActive}>{isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}</div>
    )
}

export default ActiveBusinessToggle;