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

    .businessAdminViewDetails {
        margin: 0.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
            <div>
                <div className='sectionContainer'>
                    <div className='businessAdminViewHeader'>
                        <h1>{business.business_name}</h1>
                        <button onClick={() => navigate('/event/create', { state: business_id })}>+ event</button>
                    </div>
                    {
                        (business?.formatted_address !== null) &&
                            <div>{business?.formatted_address}</div>
                    }
                    <div className='businessAdminViewDetails'>
                        <div className='businessAdminViewStatus'>{`Business Status: ${business?.active_business ? 'Active' : 'Inactive'}`}</div>
                        <div className='businessAdminViewBusinessButtons'>
                            <ActiveBusinessToggle business_id={business_id} />
                            <EditBusinessButton business={business} />
                            <DeleteBusiness business_name={business?.business_name} business_id={business?.id} />
                        </div>
                    </div>
                    <div className='businessAdminViewCreationRequest'>
                        <div>{`Manage Creation Request: ${business?.business_request_open ? 'OPEN' : 'CLOSED'}`}</div>
                        <RequestStatusToggle business_id={business_id} />
                    </div>
                </div>
                <BusinessRoles />
            </div>
        </BusinessAdminViewStyles>
    )
}

export default BusinessAdminView;