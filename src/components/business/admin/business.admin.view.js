import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import LoadingSpinner from '../../loadingSpinner';
import { useBusinessQuery } from '../../../hooks/useBusinessApi';
import BusinessRoles from '../../roles/business.roles';

import ActiveBusinessToggle from './active.business.toggle';
import RequestStatusToggle from './request.status.toggle';
import EditBusinessButton from './edit.business.button';
import DeleteBusiness from './delete.business';

const BusinessAdminViewStyles = styled.div`
    .businessAdminViewHeader {
        display: flex;
        justify-content: space-between;
    }

    .businessAdminViewControls {
        display: flex;
        justify-content: space-around;
        align-items: center;

        margin-top: 0.5rem;
        padding: 0.5rem 0;
        border-top: 1px dotted var(--secondary-color);
        border-bottom: 1px dotted var(--secondary-color);
    }
    
    .businessAdminViewDetails {
        display: flex;
        justify-content: space-between;
        align-items: center;

        border-top: 1px dotted var(--secondary-color);
        border-bottom: 1px dotted var(--secondary-color);
    }
    
    .businessAdminViewStatus {
        width: 100%;
    }
    
    .businessAdminViewBusinessButtons {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        gap: 10px;
    }
    
    .businessAdminViewCreationRequest {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px dotted var(--secondary-color);
        border-bottom: 1px dotted var(--secondary-color);
    }
`;

const BusinessAdminView = () => {
    const { business_id } = useParams()
    const { data, isLoading, isSuccess, isError } = useBusinessQuery(business_id)
    let business = {}

    let navigate = useNavigate()

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isSuccess) {
        business = data.data
    }

    if(isError) {
        navigate('/profile/admin')
        return null
    }


    return (
        <BusinessAdminViewStyles>
            <div className='sectionContainer removeBorder'>
                <div className='businessAdminViewHeader'>
                    <h1>{business.business_name}</h1>
                </div>
                {
                    (business?.formatted_address !== null) &&
                        <div>{business?.formatted_address}</div>
                }
                <div className='businessAdminViewControls'>
                    <button onClick={() => navigate('/event/create', { state: business_id })}>Create Event</button>
                    <EditBusinessButton business={business} />
                    <DeleteBusiness business_name={business?.business_name} business_id={business?.id} />
                </div>
                <div className='businessAdminViewDetails'>
                    <div className='businessAdminViewStatus'>{`Business Status: ${business?.active_business ? 'Active' : 'Inactive'}`}</div>
                    <div className='businessAdminViewBusinessButtons'>
                        <ActiveBusinessToggle business_id={business_id} isActive={business?.active_business} />
                    </div>
                </div>
                <div className='businessAdminViewCreationRequest'>
                    <div>{`Manage Creation Request: ${business?.business_request_open ? 'OPEN' : 'CLOSED'}`}</div>
                    <RequestStatusToggle business_id={business_id} isOpen={business?.business_request_open} />
                </div>
            </div>
            <BusinessRoles />
        </BusinessAdminViewStyles>
    )
}

export default BusinessAdminView;