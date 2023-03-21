import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import { useBusinessRequestToggle, useRemoveBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';
import ActiveBusinessToggle from './active.business.toggle';

const Styles = styled.div`
    .adminMenu {
        width: 100%;
        padding: 0.5rem 0
    }

    .adminButtonWrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

    .hideError {
        display: none;
    }
`;

const BusinessAdminMenu = ({ business, business_role }) => {
    const { mutateAsync: toggleBusinessRequest } = useBusinessRequestToggle()
    const { mutateAsync: removeBusiness } = useRemoveBusinessMutation()

    let navigate = useNavigate()
    const { dispatch } = useNotification()
    
    const toggleRequest = async () => {
        const business_toggled = await toggleBusinessRequest(business.id)

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

    const delete_business = async () => {
        const deleted_business = await removeBusiness(business.id)

        if(deleted_business.status === 204) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${business.business_name} has been deleted`
                }
            })

            navigate(-1)
        }

    }


    return (
        <Styles>
            <div className='adminMenu'>
                <div className='adminButtonWrapper'>
                    
                    <button onClick={() => navigate(`/business/roles/${business.id}`)}>
                        <FontAwesomeIcon icon={faUsers} />
                    </button>
                    
                    {
                        (business_role > process.env.REACT_APP_MANAGER_ACCOUNT) &&
                            <ActiveBusinessToggle business_id={business.id} active_business={business.active_business} />
                    }

                    <button onClick={toggleRequest}>
                        {
                            business.business_request_open
                                ? <FontAwesomeIcon icon={faUserPlus} />
                                : <FontAwesomeIcon icon={faUserPlus} color='red' />
                        }
                    </button>

                    {
                        (business_role > process.env.REACT_APP_MANAGER_ACCOUNT) &&
                            <button onClick={delete_business}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </button>
                    }

                </div>
                <div className={`errormessage ${(business.active_business) ? 'hideError' : ''}`}>* Business is inactive / does not show in search</div>
                <div className={`errormessage ${(business.business_request_open) ? 'hideError' : ''}`}>* Business currently not accepting 'Creator' request</div>
            </div>
        </Styles>
    )
}

export default BusinessAdminMenu;