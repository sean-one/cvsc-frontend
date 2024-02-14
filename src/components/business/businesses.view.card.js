import React from 'react';
import styled from 'styled-components';

const BusinessesViewCardStyles = styled.div`
    .businessesViewCardWrapper {
        display: flex;
        justify-content: center;
        align-items: center;

        height: 10rem;
        width: 100%;

        border-radius: 0.5rem;
        border: 1px solid var(--secondary-color);
        margin-bottom: 1.5rem;
    }
`;

const BusinessesViewCard = ({ business }) => {
    return (
        <BusinessesViewCardStyles>
            <div className='businessesViewCardWrapper'>
                <div>{business.business_name}</div>
            </div>
        </BusinessesViewCardStyles>
    )
}

export default BusinessesViewCard;