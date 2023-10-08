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
        align-items: center;
    }

    #businessSorterSearchInput {
        margin: 0; 
        padding: 0;
        border: none; 
        border-radius: 0;
        outline: none;
        appearance: none; /* For modern browsers */
        -webkit-appearance: none; /* For older versions of Safari */
        -moz-appearance: none; /* For Firefox */
        background: transparent;
        font-family: inherit; /* Inherit font from parent elements */
        font-size: inherit; /* Inherit font size from parent elements */
        background: var(--main-color);
        border-bottom: 1px solid var(--secondary-color);
        color: var(--secondary-color);
        /* color: red; */
    }

`

const BusinessSorter = ({ sortCriteria, onSortChange, searchQuery, onSearchChange }) => {
    return (
        <BusinessSorterStyles>
            <div className='businessSorter'>
                <div className='businessSorterInputWrapper'>
                    <label><SearchIcon /></label>
                    <input
                        id='businessSorterSearchInput' 
                        type="text" 
                        value={searchQuery} 
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search businesses..."
                    />
                </div>
                <div className='businessSorterInputWrapper'>
                    <label><FilterTopIcon /></label>
                    <select id='businessSorterFilterSelect' value={sortCriteria} onChange={e => onSortChange(e.target.value)}>
                        <option value="business_name">Business Name</option>
                        <option value="business_type_brand">Type: Brand</option>
                        <option value="business_type_venue">Type: Venue</option>
                        <option value="business_type_both">Type: Both</option>
                        <option value="active_business">Active</option>
                        <option value="inactive_business">Inactive</option>
                        <option value="request_closed">Request Closed</option>
                    </select>
                </div>
            </div>
        </BusinessSorterStyles>
    );
}

export default BusinessSorter;
