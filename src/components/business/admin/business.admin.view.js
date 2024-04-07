import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import useNotification from '../../../hooks/useNotification';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessQuery } from '../../../hooks/useBusinessApi';
import BusinessRoles from './business.roles';

import BusinessToggle from '../buttons/business.toggle';
import EditBusinessButton from '../buttons/edit.business.button';
import DeleteBusiness from '../buttons/delete.business';
import BusinessTransfer from './business.transfer';


import CreateEventButton from '../../events/create.event.button';
import BusinessEventsRelated from '../../events/business.events.related';
import { image_link } from '../../../helpers/dataCleanUp';

const BusinessAdminViewStyles = styled.div`
    .businessAdminViewWrapper {
        display: flex;
        flex-direction: column;
        border: 0.1rem solid red;

        @media (min-width: 76.8rem) {
            flex-direction: row;
        }
    }

    .businessAdminViewLogo {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.5rem 0;

        @media (min-width: 76.8rem) {
            margin: 4rem 0;
        }

        img {
            width: 100%;
            max-width: 35rem;
            border: 0.5rem solid var(--main-color);
            display: block;
            border-radius: 55%;
        }
    }

    .businessAdminViewDetailWrapper {
        width: 100%;
    }

    .businessAdminDetailSection {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 5rem;
        border-top: 0.1rem dotted var(--main-color);
        border-bottom: 0.1rem dotted var(--main-color);
    }

    .businessAdminViewHeader {
        color: var(--main-highlight-color);
        padding: 1rem 0;
    }

    .businessAdminViewControls {
        /* margin-top: 0.75rem; */
        color: var(--main-highlight-color);
        padding: 1.5rem 0;
    }
    
    .businessAdminDetailText {
        width: 100%;
    }
    
    .businessAdminViewBusinessButtons {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        gap: 10px;
    }

    .adminFallbackNull {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 10px;
    }

    .businessTransferSection {
        flex-direction: column;
        height: auto;
        margin-bottom: 2rem;
        /* padding: 1.5rem 0; */
        gap: 1rem;
    }

    .businessTransferSelector {
        width: 100%;
    }

    .businessTransferDescription {
        width: 100%;
        font-size: var(--small-font);
    }

    .businessTransferActionSection {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 1rem;
    }

    .businessTransferWarning {
        width: 100%;
        font-size: var(--small-font);
        color: var(--error-color);
    }
`;

const BusinessAdminView = ({ userBusinessRole }) => {

    const { dispatch } = useNotification();
    const { business_id } = useParams();
    let navigate = useNavigate();
    
    const { data: business, isPending, isError, error: business_error } = useBusinessQuery(business_id);
    
    if (isError) {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: business_error?.response?.data?.error?.message
            }
        })

        navigate('/profile/admin')
    }

    if (isPending) {
        return <LoadingSpinner />
    }

    const business_data = business?.data || {}


    return (
        <BusinessAdminViewStyles>
            <div className='businessAdminViewWrapper'>
                <div className='businessAdminViewLogo'>
                    <img src={image_link(business_data?.business_avatar)} alt={`${business_data?.business_name} branding`} />
                </div>
                <div className='businessAdminViewDetailWrapper'>
                    <div className='businessAdminViewHeader'>
                        <div onClick={() => navigate(`/business/${business_id}`)} className='headerText'>{business_data?.business_name}</div>
                        {
                            (business_data?.formatted_address !== null) &&
                                <div className='subheaderText'>{business_data?.formatted_address?.split(/\s\d{5},\sUSA/)[0]}</div>
                        }
                    </div>
                    {
                        (userBusinessRole?.role_type === 'manager' || userBusinessRole?.role_type === 'admin') &&
                            <div className='businessAdminDetailSection businessAdminViewControls'>
                                <CreateEventButton />
                                <EditBusinessButton business={business_data} />
                                {
                                    (userBusinessRole?.role_type === 'admin') &&
                                        <DeleteBusiness business_id={business_data?.id} />
                                }
                            </div>
                    }
                    {
                        (userBusinessRole?.role_type === 'admin') &&
                            <div className='businessAdminSection'>
                                <div className='businessAdminDetailSection'>
                                    <div className='businessAdminDetailText'>{`Business Status: ${business_data?.active_business ? 'Active' : 'Inactive'}`}</div>
                                    <div className='businessAdminViewBusinessButtons'>
                                        <BusinessToggle
                                            business_id={business_id}
                                            toggleStatus={business_data?.active_business}
                                            toggleType='active'
                                        />
                                    </div>
                                </div>

                                <div className='businessAdminDetailSection'>
                                    <div className='businessAdminDetailText'>{`Business Role Request: ${business_data?.business_request_open ? 'OPEN' : 'CLOSED'}`}</div>
                                    <BusinessToggle
                                        business_id={business_id}
                                        toggleStatus={business_data?.business_request_open}
                                        toggleType='request'
                                    />
                                </div>

                                <BusinessTransfer business_id={business_id} />
                            </div>
                    }
                </div>
            </div>
            <BusinessRoles />
            <BusinessEventsRelated business_id={business_id} />
        </BusinessAdminViewStyles>
    )
}

export default BusinessAdminView;