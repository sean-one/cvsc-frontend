import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMagnifyingGlass, FaFilter, FaX } from 'react-icons/fa6';

const EventSorterStyles = styled.div`
    .sorterWrapper {
        width: 100%;
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
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

    .sorterIconContainer {
        width: 3rem;
        color: var(--error-color);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sorterOptions {
        width: 100%;
        height: 100%;
        color: var(--main-highlight-color);
        max-width: var(--max-section-width);
        display: flex;
    }

    .searchSection, .filterSection {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

`;

const EventSorter = ({ sortCriteria, onSortChange, searchQuery, onSearchChange }) => {
    const [ sortType, setSortType ] = useState('');

    return (
        <EventSorterStyles>
            <div className='sorterWrapper'>
                {sortType === 'searchView' ? (
                    <div className='sortView'>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={e => onSearchChange(e.target.value)}
                            placeholder="Search events..."
                        />
                        <div className='sorterIconContainer'>
                            <FaX className='siteIcons' onClick={() => setSortType('')} />
                        </div>
                    </div>
                ) : sortType === 'filterView' ? (
                    <div className='sortView'>
                        <select value={sortCriteria} onChange={e => onSortChange(e.target.value)}>
                            <option value='eventdate'>Date</option>
                            <option value="business_name">Business Name</option>
                        </select>
                        <div className='sorterIconContainer'>
                            <FaX className='siteIcons' onClick={() => setSortType('')} />
                        </div>
                    </div>
                ) : (
                    <div className='sorterOptions'>
                        <div className='searchSection' onClick={() => setSortType('searchView')}>
                            <FaMagnifyingGlass className='siteIcons' /><span>Search</span>
                        </div>
                        <div className='filterSection' onClick={() => setSortType('filterView')}>
                            <FaFilter className='siteIcons' /><span>Filter</span>
                        </div>
                    </div>
                )}
            </div>
        </EventSorterStyles>
    );
}

export default EventSorter;