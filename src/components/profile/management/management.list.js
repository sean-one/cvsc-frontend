import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import BusinessSorter from '../../business/businessSorter';
import ManagementListItem from './management.list.item';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessManagement } from '../../../hooks/useBusinessApi';
import ServerReturnError from '../../serverReturnError';

const ManagementListStyles = styled.div`
    .managementListWrapper {
        width: 100%;
    }
    
    .businessManagementList {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
`;


const ManagementList = () => {
    const [sortCriteria, setSortCriteria] = useState('business_name'); // default sort criteria
    const [searchQuery, setSearchQuery] = useState('');
    const { auth, user_reset } = useAuth();
    const { dispatch } = useNotification();
    
    let navigate = useNavigate()

    const { data: management_list, isPending, isError, error: management_list_error } = useBusinessManagement(auth?.user?.id);

    useEffect(() => {
        if (isError) {
            // 401, 403 - type: 'token'
            if (management_list_error?.response?.data?.error?.type === 'token') {
                user_reset()
    
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: management_list_error?.response?.data?.error?.message
                    }
                })
    
                navigate('/login')
    
            } else {
                // 400 - type 'server'
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: management_list_error?.response?.data?.error?.message
                    }
                })
    
                navigate('/profile')
            }
        }
    }, [isError, management_list_error, user_reset, dispatch, navigate])
    
    const filteredBusinesses = management_list?.data.filter(business => 
        business?.business_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const sortedBusinessList = [...filteredBusinesses].sort((a, b) => {
        switch (sortCriteria) {
            case 'active_business':
                if (a.active_business && !b.active_business) return -1;
                if (!a.active_business && b.active_business) return 1;
                return 0;
            case 'inactive_business':
                if (!a.active_business && b.active_business) return -1;
                if (a.active_business && !b.active_business) return 1;
                return 0;
            case 'request_closed':
                if (!a.business_request_open && b.business_request_open) return -1;
                if (a.business_request_open && !b.business_request_open) return 1;
                return 0;
            case 'business_name':
            default:
                return a.business_name.localeCompare(b.business_name);
        }
    });

    return (
        <ManagementListStyles>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    <ServerReturnError />
                ) : (
                    <div className='managementListWrapper'>
                        <BusinessSorter 
                            sortCriteria={sortCriteria} 
                            onSortChange={setSortCriteria}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                        <div className='businessManagementList'>
                            {
                                sortedBusinessList.map(business => {
                                    return (
                                        <ManagementListItem key={business.id} business={business} />
                                    )

                                })
                            }
                        </div>
                    </div>
                )
            }
        </ManagementListStyles>
    )
}

export default ManagementList;