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
        display: grid; /* grid container */
        grid-template-areas:
        'businessadminheader'
        'businessadmindetails'
        ;
        grid-gap: 1rem;
        /* flex-direction: column; */

        @media (min-width: 768px) {
            grid-template-areas:
            'businessadminheader businessadmindetails'
            ;
        }
    }

    .businessAdminViewDetailWrapper {
        grid-area: businessadmindetails;
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
        width: 100%;
        grid-area: businessadminheader;
        color: var(--main-highlight-color);
        padding: 1rem 0;

        @media (min-width: 768px) {
            margin-top: 2rem;
        }
    }

    .businessAdminViewControls {
        /* margin-top: 0.75rem; */
        color: var(--main-highlight-color);
        padding: 1.5rem 0;
    }
    
    .businessAdminDetailText {
        width: 100%;
    }

    .activeStatus, .requestOpen {
        color: var(--main-highlight-color);
    }

    .inactiveStatus, .requestClosed {
        color: var(--error-color);
    }
    
    .businessAdminViewBusinessButtons {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        gap: 10px;
    }

    .businessTransferSection {
        flex-direction: column;
        height: auto;
        /* margin-bottom: 2rem; */
        /* padding: 1.5rem 0; */
        gap: 1rem;
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
                <div className='imagePreview businessImage'>
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
                                    <div className={`businessAdminDetailText`}>
                                        Business Status: <span className={`${business_data?.active_business ? 'activeStatus' : 'inactiveStatus'}`}>{business_data?.active_business ? 'Active' : 'Inactive'}</span>
                                    </div>
                                    <div className='businessAdminViewBusinessButtons'>
                                        <BusinessToggle
                                            business_id={business_id}
                                            toggleStatus={business_data?.active_business}
                                            toggleType='active'
                                        />
                                    </div>
                                </div>
                                <div>descriptive text in regards to what the active business status is</div>

                                <div className='businessAdminDetailSection'>
                                    <div className='businessAdminDetailText'>
                                        Business Role Request: <span className={`${business_data?.business_request_open ? 'requestOpen' : 'requestClosed'}`}>{business_data?.business_request_open ? 'OPEN' : 'CLOSED'}</span>
                                    </div>
                                    <BusinessToggle
                                        business_id={business_id}
                                        toggleStatus={business_data?.business_request_open}
                                        toggleType='request'
                                    />
                                </div>

                                <BusinessTransfer business_id={business_id} />
                            </div>
                    }
                    <BusinessRoles />
                </div>
            </div>
            <BusinessEventsRelated business_id={business_id} />
        </BusinessAdminViewStyles>
    )
}

export default BusinessAdminView;