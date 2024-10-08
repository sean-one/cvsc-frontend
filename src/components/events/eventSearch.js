import React, { useState } from 'react';
import styled from 'styled-components';
import { FaX, FaMagnifyingGlass } from 'react-icons/fa6';

const EventSearchStyles = styled.div`
    .searchWrapper {
        width: 100%;
        padding: 1rem 0.5rem;
        border-radius: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto 0.5rem;
    }
    
    .searchView {
        width: 100%;
        padding: 1rem 1.5rem;
        max-width: var(--max-section-width);
        display: flex;
        gap: 1rem;
        background: var(--opacity);
        border-radius: 0.5rem;

        input {
            width: 100%;
            font-size: var(--small-header-font);
            padding: 0.5rem 1.5rem 0.25rem;
        }
    }

    .searchHeader {
        width: 100%;
        max-width: var(--max-section-width);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

const EventSearch = ({ searchQuery, onSearchChange }) => {
    const [viewSearch, setViewSearch] = useState(false)

    const closeSearchBar = () => {
        onSearchChange('')
        setViewSearch(false)
    }

    return (
        <EventSearchStyles>
            <div className='searchWrapper'>
                {
                    viewSearch
                        ? <div className='searchView'>
                            <input
                                type='text'
                                value={searchQuery}
                                onChange={e => onSearchChange(e.target.value)}
                                placeholder="Search Upcoming events..."
                            />
                            <div>
                                <FaX className='siteIcons' style={{ color: 'var(--error-color)' }} onClick={closeSearchBar} />
                            </div>
                        </div>
                        : <div className='searchHeader'>
                            <div className="subheaderText">Upcoming Events</div>
                            <FaMagnifyingGlass className='siteIcons' onClick={() => setViewSearch(true)} />
                        </div>
                }
            </div>
        </EventSearchStyles>
    );
}

export default EventSearch;
