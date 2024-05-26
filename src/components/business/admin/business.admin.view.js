import React, { useEffect } from 'react';
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

const BusinessAdminViewStyles = styled.div`
    .businessAdminViewWrapper {
        width: 100%;
        display: grid; /* grid container */
        grid-template-areas:
        'businessadminheader'
        'businessadmindetails'
        ;
        grid-gap: 1rem;

        @media (min-width: 768px) {
            grid-template-areas:
            'businessadminheader businessadmindetails'
            ;
        }
    }

    .businessAdminViewDetailWrapper {
        grid-area: businessadmindetails;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .businessAdminDetailSection {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 5rem;
        padding: 0 0.5rem;
        background: var(--opacity);
        border-top: 0.1rem dotted var(--text-color);
        border-bottom: 0.1rem dotted var(--text-color);
    }

    .businessAdminViewHeader {
        width: 100%;
        grid-area: businessadminheader;
        color: var(--main-highlight-color);
        padding: 1rem 0.5rem;

        @media (min-width: 768px) {
            margin-top: 2rem;
        }
    }

    .businessAdminViewHeaderText {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
    }

    .businessAdminViewAddress {
        font-weight: normal;
    }

    .businessAdminViewControls {
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
    
    useEffect(() => {
        if (isError) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: business_error?.response?.data?.error?.message
                }
            })
    
            navigate('/profile')
        }
    }, [isError, business_error, dispatch, navigate])

    if (isPending) {
        return <LoadingSpinner />
    }

    const business_data = business?.data || {}


    return (
        <BusinessAdminViewStyles>
            <div className='businessAdminViewWrapper'>
                <div className='imagePreview businessImage'>
                    <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${business_data?.business_avatar}`} alt={`${business_data?.business_name} branding`} />
                </div>

                <div className='businessAdminViewDetailWrapper'>
                    <div className='businessAdminViewHeader'>
                        <div onClick={() => navigate(`/business/${business_id}`)} className='businessAdminViewHeaderText headerText'>{business_data?.business_name}</div>
                        {
                            (business_data?.formatted_address !== null) &&
                                <div className='subheaderText businessAdminViewAddress'>{business_data?.formatted_address?.replace(/, [A-Z]{2} \d{5}/, '')}</div>
                        }
                    </div>
                    {
                        (userBusinessRole?.role_type === 'manager' || userBusinessRole?.role_type === 'admin') &&
                            <div className='businessAdminDetailSection businessAdminViewControls'>
                                <CreateEventButton business_id={business_id} />
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
                                    <div className='businessAdminDetailText'>
                                        <div>
                                            Business Status: <span className={`${business_data?.active_business ? 'activeStatus' : 'inactiveStatus'}`}>{business_data?.active_business ? 'Active' : 'Inactive'}</span>
                                        </div>
                                        <div className={`${business_data?.active_business ? 'activeStatus' : 'inactiveStatus'}`} style={{ fontSize: '1.1rem'}}>
                                            {`* ${business_data?.active_business ? 'when set to inactive ' : ''}no future events / no new role request`}
                                        </div>
                                    </div>
                                    <BusinessToggle
                                        business_id={business_id}
                                        toggleStatus={business_data?.active_business}
                                        toggleType='active'
                                    />
                                </div>

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