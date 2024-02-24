import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getImageSrc } from '../../helpers/getImageSrc';

const BusinessesViewCardStyles = styled.div`
    .businessesViewCardWrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;

        border-radius: 0.5rem;
        border: 1px solid var(--secondary-color);
        margin-bottom: 1.5rem;
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
            border: 1px solid var(--trim-color);
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
        font-size: var(--small-header-font);
        font-weight: bold;
    }

    .businessViewCardAddress {
        font-size: var(--small-font);
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .businessViewCardBusinessDescription {
        display: -webkit-box;
        font-size: var(--small-font);
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 7.2rem;
        cursor: pointer;
        text-align: justify;
    }
`;

const BusinessesViewCard = ({ business }) => {
    let navigate = useNavigate();

    const trimAddress = (address) => {
        if (address === null) {
            return null
        } else {
            const cut_up_address = address.split(',').slice(0, -2).join(',')
            return cut_up_address;
        }
    }


    return (
        <BusinessesViewCardStyles>
            <div className='businessesViewCardWrapper' onClick={() => navigate(`/business/${business?.id}`)}>
                <div className='businessViewCardBranding'>
                    <img src={getImageSrc(business.business_avatar)} alt={business.business_name} />
                </div>
                <div className='businessViewCardDetails'>
                    <div className='businessViewCardBusinessName'>{business.business_name}</div>
                    <div className='businessViewCardAddress'>{trimAddress(business?.formatted_address)}</div>
                    <div className='businessViewCardBusinessDescription'>{business?.business_description}</div>
                </div>
            </div>
        </BusinessesViewCardStyles>
    )
}

export default BusinessesViewCard;