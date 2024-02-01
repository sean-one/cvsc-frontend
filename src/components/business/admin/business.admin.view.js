import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import LoadingSpinner from '../../loadingSpinner';
import { useBusinessQuery } from '../../../hooks/useBusinessApi';
import BusinessRoles from './business.roles';

import BusinessToggle from '../buttons/business.toggle';
import EditBusinessButton from '../buttons/edit.business.button';
import DeleteBusiness from '../buttons/delete.business';

import CreateEventButton from '../../events/create.event.button';
import BusinessEventsRelated from '../../events/business.events.related';

const BusinessAdminViewStyles = styled.div`
    .businessAdminViewControls {
        display: flex;
        justify-content: space-around;
        align-items: center;

        margin-top: 0.75rem;
        padding: 1.5rem 0;
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

const BusinessAdminView = ({ userBusinessRole }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { business_id } = useParams();
    let navigate = useNavigate();
    
    const { data: business, status: business_status } = useBusinessQuery(business_id);

    const handleDeleteStart = () => {
        setIsDeleting(true)
    };

    const handleDeleteSuccess = () => {
        navigate('/profile/admin')
    };

    useEffect(() => {
        if (business_status === 'error' && !isDeleting) {
            navigate('/')
        }
    }, [navigate, business_status, isDeleting])
    
    if (isDeleting || business_status === 'loading') {
        return <LoadingSpinner />
    }
    
    const business_data = business?.data || {}


    return (
        <BusinessAdminViewStyles>
            <div className='sectionContainer removeBorder'>
                <div onClick={() => navigate(`/business/${business_id}`)} className='headerText'>{business_data.business_name}</div>
                {
                    (business_data?.formatted_address !== null) &&
                        <div className='subheaderText'>{business_data?.formatted_address.split(/\s\d{5},\sUSA/)[0]}</div>
                }
                {
                    (userBusinessRole?.role_type === 'manager' || userBusinessRole?.role_type === 'admin') &&
                        <div className='businessAdminViewControls'>
                            <CreateEventButton business_id={business_id} />
                            <EditBusinessButton business={business_data} />
                            {
                                (userBusinessRole?.role_type === 'admin') &&
                                    <DeleteBusiness business_id={business_data?.id} onDeleteStart={handleDeleteStart} onDeleteSuccess={handleDeleteSuccess} />
                            }
                        </div>
                }
                {
                    (userBusinessRole?.role_type === 'admin') &&
                        <div className='businessAdminViewDetails'>
                            <div className='businessAdminViewStatus'>{`Business Status: ${business_data?.active_business ? 'Active' : 'Inactive'}`}</div>
                            <div className='businessAdminViewBusinessButtons'>
                                <BusinessToggle
                                    business_id={business_id}
                                    toggleStatus={business_data?.active_business}
                                    toggleType='active'
                                />
                            </div>
                        </div>

                }
                {
                    (userBusinessRole?.role_type === 'admin') &&
                        <div className='businessAdminViewCreationRequest'>
                            <div>{`Business Role Request: ${business_data?.business_request_open ? 'OPEN' : 'CLOSED'}`}</div>
                            <BusinessToggle
                                business_id={business_id}
                                toggleStatus={business_data?.business_request_open}
                                toggleType='request'
                            />
                        </div>
                }
            </div>
            <BusinessRoles />
            <BusinessEventsRelated business_id={business_id} />
        </BusinessAdminViewStyles>
    )
}

export default BusinessAdminView;