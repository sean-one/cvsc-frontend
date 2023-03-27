import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import { faCannabis, faTrash, faStore } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { useRemoveEventBusinessMutation } from '../../hooks/useEventsApi';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';

const BusinessLabelStyles = styled.div`
    .businessLabelStylesWrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid red;

        @media (min-width: 360px) {
            border-bottom: none;
        }
    }

    .businessLogoContainer {
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0.5rem;

        img {
            display: block;
            width: 100%;
            max-width: 60px;
            border-radius: 50%;
        }
    }

    .businessDetailsWrapper {
        width: 100%;
        display: flex;
        justify-content: center;

        div {
            padding-right: 0.5rem;
        }

        .trashIcon {
            margin: 0.25rem 0.5rem;
        }
    }
`;


const BusinessLabel = ({ business_id, event_id, business_type }) => {
    const { data: businessList, isLoading, isSuccess } = useBusinessesQuery()
    let business = {}
    let business_name = ''
    let business_role = {}

    const { auth, logout_user } = useAuth()
    const { mutateAsync: removeEventBusinessMutation } = useRemoveEventBusinessMutation()
    // const { event_id } = useParams()
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

    if(isLoading) { <LoadingSpinner /> }

    if(isSuccess) {
        business = businessList?.data.find(business => business.id === business_id)
        business_name = business?.business_name
        if(auth?.roles) {
            business_role = auth?.roles.find(role => role.business_id === business_id)
        }
    }


    return (
        <BusinessLabelStyles>
            <div className='businessLabelStylesWrapper'>
                <div className='businessLogoContainer' onClick={() => navigate(`/business/${business_id}`)}>
                    <img src={business?.business_avatar} alt='business branding' />
                </div>
                <div className='businessDetailsWrapper'>
                    <div onClick={() => navigate(`/business/${business_id}`)}>{business.business_name}</div>
                    {
                        (business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT)
                            ? <div onClick={remove_event_business}>
                                <FontAwesomeIcon icon={faTrash} className='trashIcon'/>
                            </div>
                            : null
                    }
                </div>
            </div>
        </BusinessLabelStyles>
    )
}

export default BusinessLabel;