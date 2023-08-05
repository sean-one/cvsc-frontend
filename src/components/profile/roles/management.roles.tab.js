import React from 'react';
import styled from 'styled-components';

// import useAuth from '../../../hooks/useAuth';
import { usePendingBusinessRolesQuery } from '../../../hooks/useRolesApi';
import LoadingSpinner from '../../loadingSpinner';
import AllManagementPendingRequest from './all.management.pending.request';

const ManagementRolesTabStyles = styled.div`
    .managementRolesTabWrapper {
        padding: 1.75rem 0 0;
    }

    .managementRolesTabHeader {
        width: 100%;
        text-align: center;
        font-weight: bold;
        font-size: 1.5rem;
        letter-spacing: 0.1rem;
    }
`;

const ManagementRolesTab = ({ user_id }) => {
    // const { auth } = useAuth()
    const { data: pending_roles, isLoading, isSuccess } = usePendingBusinessRolesQuery(user_id)
    const businesses = {};

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isSuccess) {

        pending_roles.data.forEach(role => {
            const businessName = role.business_name;
    
            if (!businesses[businessName]) {
                businesses[businessName] = [];
            }
    
            businesses[businessName].push(role);
        });

    }


    return (
        <ManagementRolesTabStyles>
            <div className='managementRolesTabWrapper'>
                {
                    (pending_roles.data.length > 0) &&
                        <div className='managementRolesTabHeader'>Management Roles</div>
                }
                {
                    Object.entries(businesses).map(([businessName, roles]) => (
                        <AllManagementPendingRequest key={businessName} name={businessName} roles={roles} pending_roles={pending_roles.data} />
                    ))
                }
            </div>
        </ManagementRolesTabStyles>
    )
}

export default ManagementRolesTab;