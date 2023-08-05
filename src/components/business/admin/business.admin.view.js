import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import LoadingSpinner from '../../loadingSpinner';
import { useBusinessQuery } from '../../../hooks/useBusinessApi';
import BusinessRoles from '../../roles/business.roles';

const BusinessAdminViewStyles = styled.div`
    .businessAdminViewWrapper {
        display: flex;
        flex-direction: column;
    }

    .businessAdminViewBusinessHeader {
        display: flex;
        flex-direction: column;
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
`;

const BusinessAdminView = () => {
    const { business_id } = useParams()
    const { data: business, isLoading } = useBusinessQuery(business_id)

    if(isLoading) {
        return <LoadingSpinner />
    }


    return (
        <BusinessAdminViewStyles>
            <div className='businessAdminViewWrapper'>
                <div className='businessAdminViewBusinessHeader'>
                    <h2>{business.data.business_name}</h2>
                    {
                        (business?.data.formatted_address !== null) &&
                            <div>{business?.data?.formatted_address}</div>
                    }
                </div>
                <div className='businessAdminViewDetails'>
                    <div className='businessAdminViewStatus'>{`Business Status: ${business?.data.active_business ? 'Active' : 'Inactive'}`}</div>
                    <div className='businessAdminViewBusinessButtons'>
                        <button>status</button>
                        <button>edit</button>
                        <button>delete</button>
                    </div>
                </div>
                <div>
                    <h4>Current User Roles</h4>
                    <div>
                        <div>Manage Creation Request:</div>
                    </div>
                    <div>
                        <BusinessRoles />
                    </div>
                </div>
            </div>
        </BusinessAdminViewStyles>
    )
}

export default BusinessAdminView;