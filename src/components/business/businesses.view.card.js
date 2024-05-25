import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const BusinessesViewCardStyles = styled.div`
    .businessesViewCardWrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;

        border-radius: 0.5rem;
        border: 0.1rem solid var(--text-color);
        margin-bottom: 1.5rem;
        max-width: var(--max-section-width);
        background-color: var(--opacity);
    }

    .businessViewCardBranding {
        width: 100%;
        max-width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1.125rem 0.75rem;

        img {
            width: 100%;
            border: 0.1rem solid var(--text-color);
            display: block;
            border-radius: 50%;
        }
    }

    .businessViewCardDetails {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .businessViewCardBusinessName {
        color: var(--main-highlight-color);
        font-size: var(--small-header-font);
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
    }
    
    .businessViewCardAddress {
        color: var(--main-highlight-color);
        font-size: var(--small-font);
        margin-bottom: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: normal;
    }

    .businessViewCardBusinessDescription {
        display: -webkit-box;
        font-size: var(--small-font);
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        text-align: justify;
        color: var(--text-color);
    }
`;

const BusinessesViewCard = ({ business }) => {
    let navigate = useNavigate();

    
    return (
        <BusinessesViewCardStyles>
            <div className='businessesViewCardWrapper' onClick={() => navigate(`/business/${business?.id}`)}>
                <div className='businessViewCardBranding'>
                    <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${business?.business_avatar}`} alt={business.business_name} />
                </div>
                <div className='businessViewCardDetails'>
                    <div className='businessViewCardBusinessName'>{business.business_name}</div>
                    <div className='businessViewCardAddress'>{business?.formatted_address?.replace(/, [A-Z]{2} \d{5}/, '')}</div>
                    <div className='businessViewCardBusinessDescription'>{business?.business_description}</div>
                </div>
            </div>
        </BusinessesViewCardStyles>
    )
}

export default BusinessesViewCard;