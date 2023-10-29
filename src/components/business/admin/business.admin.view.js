import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import LoadingSpinner from '../../loadingSpinner';
import useAuth from '../../../hooks/useAuth';
import { useBusinessQuery } from '../../../hooks/useBusinessApi';
import BusinessRoles from './business.roles';

import ActiveBusinessToggle from './active.business.toggle';
import RequestStatusToggle from './request.status.toggle';
import EditBusinessButton from './edit.business.button';
import DeleteBusiness from './delete.business';
import CreateEventButton from '../../events/create.event.button';
import BusinessEventsRelated from '../../events/business.events.related';

const BusinessAdminViewStyles = styled.div`
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
    const { auth } = useAuth()
    const { business_id } = useParams()
    const { data, status } = useBusinessQuery(business_id)
    let business, business_role = {}

    let navigate = useNavigate()
    
    if(status === 'error') {
        navigate('/profile/admin')
        return null
    }

    if(status === 'loading') {
        return <LoadingSpinner />
    }
    
    if(auth?.roles) { business_role = auth.roles.find(role => role.business_id === business_id) }
    
    business = data.data


    return (
        <BusinessAdminViewStyles>
            <div className='sectionContainer removeBorder'>
                <div className='sectionRowSplit'>
                    <div onClick={() => navigate(`/business/${business_id}`)} className='headerText'>{business.business_name}</div>
                    {
                        (business_role?.role_type < process.env.REACT_APP_ADMIN_ACCOUNT && business_role?.active_role === true) &&
                            <CreateEventButton business_id={business_id} /> 
                    }
                </div>
                {
                    (business?.formatted_address !== null) &&
                        <div className='subheaderText'>{business?.formatted_address.split(/\s\d{5},\sUSA/)[0]}</div>
                }
                {
                    (business_role?.role_type >= process.env.REACT_APP_ADMIN_ACCOUNT && business_role?.active_role === true) &&
                        <div className='businessAdminViewControls'>
                            <CreateEventButton business_id={business_id} />
                            <EditBusinessButton business={business} />
                            <DeleteBusiness business_name={business?.business_name} business_id={business?.id} />
                        </div>
                }
                {
                    (business_role?.role_type >= process.env.REACT_APP_ADMIN_ACCOUNT && business_role?.active_role === true) &&
                        <div className='businessAdminViewDetails'>
                            <div className='businessAdminViewStatus'>{`Business Status: ${business?.active_business ? 'Active' : 'Inactive'}`}</div>
                            <div className='businessAdminViewBusinessButtons'>
                                <ActiveBusinessToggle business_id={business_id} isActive={business?.active_business} />
                            </div>
                        </div>

                }
                {
                    (business_role?.role_type >= process.env.REACT_APP_ADMIN_ACCOUNT && business_role?.active_role === true) &&
                        <div className='businessAdminViewCreationRequest'>
                            <div>{`Business Role Request: ${business?.business_request_open ? 'OPEN' : 'CLOSED'}`}</div>
                            <RequestStatusToggle business_id={business_id} isOpen={business?.business_request_open} />
                        </div>
                }
            </div>
            <BusinessRoles />
            <BusinessEventsRelated business_id={business_id} />
        </BusinessAdminViewStyles>
    )
}

export default BusinessAdminView;