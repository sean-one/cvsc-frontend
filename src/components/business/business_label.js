import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis, faTrash } from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../hooks/useAuth';
import { useRemoveEventBusinessMutation } from '../../hooks/useEventsApi';
import useNotification from '../../hooks/useNotification';


const BusinessLabel = ({ business_id, business_name, business_role, business_type }) => {
    const { logout_user } = useAuth()
    const { mutateAsync: removeEventBusinessMutation } = useRemoveEventBusinessMutation()
    const { event_id } = useParams()
    const { dispatch } = useNotification()

    let navigate = useNavigate()

    const remove_event_business = async () => {
        try {
            const remove_business_response = await removeEventBusinessMutation({ event_id, event_updates: { business_id, business_type } })

            if (remove_business_response.status === 202) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${business_name} has been removed`
                    }
                })

                navigate('/profile')
            }

        } catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error.response.data.error.message
                    }
                })


            }

            logout_user()
        }

    }


    return (
        <div className={`d-flex justify-content-end ${(business_type === 'brand') ? 'text-end' : 'flex-row-reverse text-start'} align-items-center w-100`}>
            <div onClick={() => navigate(`/business/${business_id}`)}>{business_name}</div>
            {
                (business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT)
                    ? <FontAwesomeIcon onClick={remove_event_business} icon={faTrash} className={`${(business_type === 'brand') ? 'ms-2' : 'me-2'}`} />
                    : <FontAwesomeIcon onClick={() => navigate(`/business/${business_id}`)} icon={faCannabis} className={`${(business_type === 'brand') ? 'ms-2' : 'me-2'}`} />
            }
        </div>
    )
}

export default BusinessLabel;