import React from 'react';
import styled from 'styled-components';
import { FaX } from 'react-icons/fa6';

const EventSearchStyles = styled.div`
    .searchWrapper {
        width: 100%;
        padding: 0 2rem;
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

        input {
            width: 100%;
        }
    }

    .searchIconContainer {
        width: 3rem;
        height: 100%;
        color: var(--error-color);
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        padding-bottom: 0.25rem;
    }
`;

const EventSearch = ({ searchQuery, onSearchChange }) => {
    return (
        <EventSearchStyles>
            <div className='searchWrapper'>
                <div className='sortView'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search events..."
                    />
                    <div className='searchIconContainer'>
                        <FaX className='siteIcons' onClick={() => onSearchChange('')} />
                    </div>
                </div>
            </div>
        </EventSearchStyles>
    );
}

export default EventSearch;
