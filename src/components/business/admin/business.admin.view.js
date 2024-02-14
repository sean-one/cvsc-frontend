import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import useNotification from '../../../hooks/useNotification';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessQuery, useBusinessTransferMutation } from '../../../hooks/useBusinessApi';
import { useBusinessRolesQuery } from '../../../hooks/useRolesApi';
import BusinessRoles from './business.roles';

import BusinessToggle from '../buttons/business.toggle';
import EditBusinessButton from '../buttons/edit.business.button';
import DeleteBusiness from '../buttons/delete.business';
import { ShowIcon, HideIcon } from '../../icons/siteIcons';

import CreateEventButton from '../../events/create.event.button';
import BusinessEventsRelated from '../../events/business.events.related';

const BusinessAdminViewStyles = styled.div`
    .businessAdminDetailSection {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 5rem;
        border-top: 1px dotted var(--secondary-color);
        border-bottom: 1px dotted var(--secondary-color);
    }
    .businessAdminViewControls {
        margin-top: 0.75rem;
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
    const [ transferManagerSelected, setTransferManagerSelected ] = useState('');
    const [ transferAdminEditView, setTransferAdminEditView ] = useState(false)
    const { dispatch } = useNotification();
    const { business_id } = useParams();
    let navigate = useNavigate();
    
    const { data: business, isPending, isError, error: business_error } = useBusinessQuery(business_id);
    const { data: manager_list, isPending: managerListPening, isError: managerListError } = useBusinessRolesQuery(business_id)

    const { mutate: businessTransfer } = useBusinessTransferMutation()

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

    const handleManagerSelectChange = (e) => {
        setTransferManagerSelected(e.target.value)
    }

    // Function to validate UUID
    const isValidUUID = (value) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regex.test(value);
    };

    const transferBusiness = (manager_id) => {
        businessTransfer({ business_id: business?.data?.id, manager_id: manager_id })
    }
    
    const business_data = business?.data || {}
    const management_list = manager_list?.data?.filter(manager_role => manager_role.role_type === 'manager') || []


    return (
        <BusinessAdminViewStyles>
            <div className='sectionContainer removeBorder'>
                <div onClick={() => navigate(`/business/${business_id}`)} className='headerText'>{business_data?.business_name}</div>
                {
                    (business_data?.formatted_address !== null) &&
                        <div className='subheaderText'>{business_data?.formatted_address?.split(/\s\d{5},\sUSA/)[0]}</div>
                }
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

                            <div className='businessAdminDetailSection'>
                                <div className='businessAdminDetailText'>Transfer Business</div>
                                <div className='businessTransferEdit' onClick={() => setTransferAdminEditView(!transferAdminEditView)}>{transferAdminEditView ? <HideIcon /> : <ShowIcon />}</div>
                            </div>

                            {
                                transferAdminEditView
                                    ? <div className='businessAdminDetailSection businessTransferSection'>

                                        <div className='businessTransferDescription'>allows transfer of the business and business admin role to a manager</div>
                                        
                                        {
                                            (management_list?.length > 0) &&
                                                <div className='businessTransferActionSection'>
                                                    <div className='businessTransferSelector'>
                                                        <select value={transferManagerSelected} onChange={handleManagerSelectChange}>
                                                            <option value=''>Select Manager...</option>
                                                            {
                                                                management_list?.map(manager => (
                                                                    <option key={manager.user_id} value={manager.user_id}>{manager.username}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className='businessTransferSubmitButton'>
                                                        <button disabled={!isValidUUID(transferManagerSelected)} onClick={() => transferBusiness(transferManagerSelected)}>transfer</button>
                                                    </div>
                                                </div>
                                        }

                                        <div className='businessTransferWarning'>{ management_list?.length > 0 ? '* this action cannot be undone' : '* business can only be transferred to a current manager' }</div>
                                    </div>
                                    : null
                            }

                        </div>
                }
                <BusinessRoles />
                <BusinessEventsRelated business_id={business_id} />
            </div>
        </BusinessAdminViewStyles>
    )
}

export default BusinessAdminView;