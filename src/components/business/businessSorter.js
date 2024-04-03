import React, { useState } from 'react';
import styled from 'styled-components'

import { FilterIcon, SearchIcon, CloseIcon } from '../icons/siteIcons';

const BusinessSorterStyles = styled.div`
    .businessSorterWrapper {
        width: 100%;
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
    }
    
    .businessSorter {
        width: 100%;
        height: 100%;
        max-width: var(--max-section-width);
        display: flex;
    }
    
    .sortView {
        width: 100%;
        height: 100%;
        max-width: var(--max-section-width);
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
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .iconContainer {
        width: 3rem;
        color: var(--error-color);
        display: flex;
        justify-content: center;
        align-items: center;
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
                        <div className='iconContainer'>
                            <CloseIcon onClick={() => setSortType('')}/>
                        </div>
                    </div>
                ) : sortType === 'filterView' ? (
                    <div className='sortView'>
                        <select value={sortCriteria} onChange={e => onSortChange(e.target.value)}>
                            <option value="business_name">Name</option>
                            <option value="active_business">Active</option>
                            <option value="inactive_business">Inactive</option>
                            <option value="request_closed">Request Closed</option>
                        </select>
                        <div className='iconContainer'>
                            <CloseIcon onClick={() => setSortType('')} />
                        </div>
                    </div>
                ) : (
                    <div className='businessSorter'>
                        <div className='searchSection' onClick={() => setSortType('searchView')}>
                            <SearchIcon /><span>Search</span>
                        </div>
                        <div className='filterSection' onClick={() => setSortType('filterView')}>
                            <FilterIcon /><span>Filter</span>
                        </div>
                    </div>
                )}
            </div>
        </BusinessSorterStyles>
    );
}

export default BusinessSorter;
