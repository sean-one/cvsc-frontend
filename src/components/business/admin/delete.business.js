import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';

const DeleteBusiness = ({ business_id, business_name }) => {

    const { mutateAsync: removeBusiness } = useRemoveBusinessMutation()
    const { dispatch } = useNotification()

    let navigate = useNavigate()

    const delete_business = async () => {
        const deleted_business = await removeBusiness(business_id)

        if(deleted_business.status === 204) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${business_name} has been deleted`
                }
            })

            navigate(-1)
        }

    }


    return (
        <button onClick={delete_business}>
            <FontAwesomeIcon icon={faTrash}/>
        </button>
    )
}

export default DeleteBusiness;