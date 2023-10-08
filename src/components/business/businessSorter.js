import React from 'react';
import styled from 'styled-components'

import { FilterTopIcon, SearchIcon } from '../icons/siteIcons';

const BusinessSorterStyles = styled.div`
    .businessSorter {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .businessSorterInputWrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;

        input, select {
            font-size: 1.1rem;

            ::placeholder {
                color: var(--secondary-color);
            }
        }

        label {
            align-self: flex-end;
            padding-bottom: 0.25rem;
            border-bottom: 1px solid var(--secondary-color);
        }
    }

`

const BusinessSorter = ({ sortCriteria, onSortChange, searchQuery, onSearchChange }) => {
    return (
        <BusinessSorterStyles>
            <div className='businessSorter'>
                <div className='businessSorterInputWrapper'>
                    <label><SearchIcon /></label>
                    <input
                        type="text" 
                        value={searchQuery} 
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search businesses..."
                    />
                </div>
                <div className='businessSorterInputWrapper'>
                    <select value={sortCriteria} onChange={e => onSortChange(e.target.value)}>
                        <option value="business_name">Business Name</option>
                        <option value="business_type_brand">Type: Brand</option>
                        <option value="business_type_venue">Type: Venue</option>
                        <option value="business_type_both">Type: Both</option>
                        <option value="active_business">Active</option>
                        <option value="inactive_business">Inactive</option>
                        <option value="request_closed">Request Closed</option>
                    </select>
                    <label><FilterTopIcon /></label>
                </div>
            </div>
        </BusinessSorterStyles>
    );
}

export default BusinessSorter;
