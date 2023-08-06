import React from 'react';

import { useActiveBusinessToggle } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const ActiveBusinessToggle = ({ business_id }) => {
    const { dispatch } = useNotification()
    const { mutateAsync: toggleActiveBusiness } = useActiveBusinessToggle()

    const toggleActive = async () => {

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
    }

    
    return (
        <button onClick={toggleActive}>Status</button>
    )
}

export default ActiveBusinessToggle;