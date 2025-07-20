import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashCan } from 'react-icons/fa6';

import { useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const DeleteBusiness = ({ business_id }) => {
    const { dispatch } = useNotification()

    let navigate = useNavigate();

    const { mutate: removeBusiness } = useRemoveBusinessMutation();

    const delete_business = () => {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: `Please click 'Delete' to confirm`,
                actions: [
                    {
                        label: 'Delete',
                        onClick: () => {
                            removeBusiness(business_id)
                            navigate('/profile')
                        }
                    },
                    {
                        label: 'Cancel',
                        onClick: () => {}
                    }
                ]
            }
        })
    }


    return (
        <div onClick={delete_business}><FaTrashCan className='siteIcons' style={{ color: 'var(--error-color)' }} /></div>
    )
}

export default DeleteBusiness;