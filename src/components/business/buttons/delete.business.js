import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import { DeleteIcon } from '../../icons/siteIcons';
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
        <div onClick={delete_business}><DeleteIcon /></div>
    )
}

export default DeleteBusiness;