import React, { useState } from 'react';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';
import BusinessSorter from './businessSorter';

import BusinessesViewCard from './businesses.view.card';
import EmptyListReturn from '../emptylist.return';

const BusinessesViewStyles = styled.div`
    .businessesViewWrapper {
        width: 100%;
    }

    .businessesViewList {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

const BusinessesView = () => {
    const [sortCriteria, setSortCriteria] = useState('business_name'); // default sort by business name
    const [searchQuery, setSearchQuery] = useState('');

    const { dispatch } = useNotification();
    const { data: businesses_list, isPending, isError, error: businesses_list_error } = useBusinessesQuery();

    if (isError) {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: businesses_list_error?.response?.data?.error?.message
            }
        })
    }

    const filteredBusinesses = businesses_list?.data.filter(business =>
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
        <BusinessesViewStyles>
            <Helmet>
                <title>CVSC - Business List</title>
            </Helmet>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : (
                    (businesses_list?.data?.length === 0)
                        ? <EmptyListReturn listtype='business' />
                        
                        : <div className='businessesViewWrapper'>
                            <BusinessSorter
                                sortCriteria={sortCriteria}
                                onSortChange={setSortCriteria}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                            />
                            <div className='businessesViewList'>
                                {
                                    sortedBusinessList?.map(business => {
                                        return (
                                            <BusinessesViewCard key={business.id} business={business} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                )
            }
        </BusinessesViewStyles>
    )
}

export default BusinessesView;