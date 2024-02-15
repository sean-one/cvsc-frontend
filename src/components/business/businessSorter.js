import React, { useState } from 'react';
import styled from 'styled-components'

import { FilterIcon, SearchIcon, CloseIcon } from '../icons/siteIcons';

const BusinessSorterStyles = styled.div`
    .businessSorterWrapper {
        margin-bottom: 1rem;
    }

    .businessSorter {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0.75rem 0;
    }

    .sortView {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;

        input, select {
            width: 100%;
        }
    }

    .searchSection, .filterSection {
        width: 100%;
        text-align: center;
    }
`

const BusinessSorter = ({ sortCriteria, onSortChange, searchQuery, onSearchChange }) => {
    const [sortType, setSortType] = useState('');
    
    return (
        <BusinessSorterStyles>
            <div className='businessSorterWrapper'>
                {sortType === 'searchView' ? (
                    <div className='sortView'>
                        <input
                            type="text" 
                            value={searchQuery} 
                            onChange={e => onSearchChange(e.target.value)}
                            placeholder="Search businesses..."
                        />
                        <CloseIcon onClick={() => setSortType('')} />
                    </div>
                ) : sortType === 'filterView' ? (
                    <div className='sortView'>
                        <select value={sortCriteria} onChange={e => onSortChange(e.target.value)}>
                            <option value="business_name">Name</option>
                            <option value="business_type_brand">Type: Brand</option>
                            <option value="business_type_venue">Type: Venue</option>
                            <option value="business_type_both">Type: Both</option>
                            <option value="active_business">Active</option>
                            <option value="inactive_business">Inactive</option>
                            <option value="request_closed">Request Closed</option>
                        </select>
                        <CloseIcon onClick={() => setSortType('')} />
                    </div>
                ) : (
                    <div className='businessSorter'>
                        <div className='searchSection' onClick={() => setSortType('searchView')}>
                            <SearchIcon />
                        </div>
                        <div className='filterSection' onClick={() => setSortType('filterView')}>
                            <FilterIcon />
                        </div>
                    </div>
                )}
            </div>
        </BusinessSorterStyles>
    );
}

export default BusinessSorter;
