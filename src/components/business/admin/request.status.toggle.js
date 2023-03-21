import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { useBusinessRequestToggle } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const RequestStatusToggle = ({ business_id, request_status }) => {
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
        <button onClick={toggleRequest}>
            {
                request_status
                    ? <FontAwesomeIcon icon={faUserPlus} />
                    : <FontAwesomeIcon icon={faUserPlus} color='gray' />
            }
        </button>
    )
}

export default RequestStatusToggle;