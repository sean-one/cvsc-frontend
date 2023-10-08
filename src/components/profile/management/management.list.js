import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BusinessSorter from '../../business/businessSorter';
import ManagementListItem from './management.list.item';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import useAuth from '../../../hooks/useAuth';

const ManagementList = () => {
    const [sortCriteria, setSortCriteria] = useState('business_name'); // default sort criteria
    const [searchQuery, setSearchQuery] = useState('');
    const { auth, logout_user } = useAuth()
    let business_list = []
    let navigate = useNavigate()

    const { data: businesses, isLoading, isError } = useBusinessesQuery()

    if (isLoading) {
        return <LoadingSpinner />
    }
    
    if(isError) {
        logout_user()
        navigate('/login')
        return false
    }
    
    const manager_roles = auth?.roles.filter(role => role.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && role.active_role).map(role => role.business_id)
    business_list = businesses.data.filter(business => manager_roles.includes(business.id))

    const filteredBusinesses = business_list.filter(business => 
        business.business_name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div>
            <BusinessSorter 
                sortCriteria={sortCriteria} 
                onSortChange={setSortCriteria}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            {
                sortedBusinessList.map(business => (
                    <ManagementListItem key={business.id} business={business} />
                ))
            }
        </div>
    )
}

export default ManagementList;