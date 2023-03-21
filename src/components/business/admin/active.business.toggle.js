import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

import { useActiveBusinessToggle } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';

const ActiveBusinessToggle = ({ business_id, active_business }) => {
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
        <button onClick={toggleActive}>
            {
                active_business
                    ? <FontAwesomeIcon icon={faBuilding} />
                    : <FontAwesomeIcon icon={faBuilding} color='gray' />
            }
        </button>
    )
}

export default ActiveBusinessToggle;