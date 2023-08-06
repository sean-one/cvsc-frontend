import React from 'react';

import { useBusinessRequestToggle } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const RequestStatusToggle = ({ business_id }) => {
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
        <button onClick={toggleRequest}>toggle</button>
    )
}

export default RequestStatusToggle;