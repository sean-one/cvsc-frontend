import React, { useState } from 'react';
import styled from 'styled-components';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';

import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';
import BusinessSorter from './businessSorter';

import BusinessesViewCard from './businesses.view.card';

const BusinessesViewStyles = styled.div`
    .businessesViewWrapper {
        /* background-color: red; */
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
    );

    const sortedBusinessList = [...filteredBusinesses].sort((a, b) => {
        switch (sortCriteria) {
            case 'business_type_brand':
                if (a.business_type === 'brand' && b.business_type !== 'brand') return -1;
                if (a.business_type !== 'brand' && b.business_type === 'brand') return 1;
                return 0;
            case 'business_type_venue':
                if (a.business_type === 'venue' && b.business_type !== 'venue') return -1;
                if (a.business_type !== 'venue' && b.business_type === 'venue') return 1;
                return 0;
            case 'business_type_both':
                if (a.business_type === 'both' && b.business_type !== 'both') return -1;
                if (a.business_type !== 'both' && b.business_type === 'both') return 1;
                return 0;
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
            <div className='businessesViewWrapper'>
                <BusinessSorter
                    sortCriteria={sortCriteria}
                    onSortChange={setSortCriteria}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
                {/* <div className='searchFilterControl'>
                    {view === 'searchView' ? (
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    ) : view === 'filterView' ? (
                        <select
                            onChange={(e) => setFilterCriteria(e.target.value)}
                        >
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <>
                            <button onClick={handleSearchIconClick}>Search Icon</button>
                            <button onClick={handleFilterIconClick}>Filter Icon</button>
                        </>
                    )}
                </div> */}
                {
                    isPending ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        null
                    ) : (
                        <div>
                            {
                                sortedBusinessList?.map(business => {
                                    return (
                                        <BusinessesViewCard keu={business.id} business={business} />
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        </BusinessesViewStyles>
    )
}

export default BusinessesView;