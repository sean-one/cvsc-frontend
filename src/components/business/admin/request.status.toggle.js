import React from 'react';

import { ToggleOnIcon, ToggleOffIcon } from '../../icons/siteIcons';

import { useBusinessRequestToggle } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const RequestStatusToggle = ({ business_id, isOpen }) => {
    const { mutateAsync: toggleBusinessRequest } = useBusinessRequestToggle()
    
    const { dispatch } = useNotification()

    const toggleRequest = async () => {
        const business_toggled = await toggleBusinessRequest(business_id)

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

    return (
        <div onClick={toggleRequest}>{(isOpen ? <ToggleOnIcon /> : <ToggleOffIcon />)}</div>
    )
}

export default RequestStatusToggle;