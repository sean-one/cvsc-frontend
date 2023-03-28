import React from 'react';
import styled from 'styled-components';

import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import LoadingSpinner from '../loadingSpinner';
import { image_link } from '../../helpers/dataCleanUp';

const BusinessLabelsStyles = styled.div`
    .businessLabelsContainer {
        border-top: 1px solid #dcdbc4;
        margin-top: 0.5rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .businessLogoContainer {
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0.5rem;

        img {
            display: block;
            width: 100%;
            max-width: 45px;
            border-radius: 50%;
        }
    }

    .businessListing {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        @media (max-width: 350px) {
            width: 100%;
            justify-content: center;
        }

        @media (min-width: 768px) {
            align-self: flex-end;
        }
    }

    .brandListing {
        flex-direction: row-reverse;
    }

    .businessName {
        @media (max-width: 350px) {
            display: none;
        }
    }
`;


const BusinessLabels = ({ brand_id, venue_id }) => {
    const { data: businessList, isLoading, isSuccess } = useBusinessesQuery()
    let brand = {}
    let venue = {}

    if(isLoading) { return <LoadingSpinner /> }
    
    if(isSuccess) {
        brand = businessList?.data.find(business => business.id === brand_id)
        venue = businessList?.data.find(business => business.id === venue_id)
    }


    return (
        <BusinessLabelsStyles>
            <div className='businessLabelsContainer'>
                <div className='businessListing venueListing'>
                    <div className='businessLogoContainer'>
                        <img src={image_link(venue?.business_avatar)} alt='venue branding' />
                    </div>
                    <div className='businessName'>{venue?.business_name}</div>
                </div>
                <div className='businessListing brandListing'>
                    <div className='businessLogoContainer'>
                        <img src={image_link(brand?.business_avatar)} alt='brand branding' />
                    </div>
                    <div className='businessName'>{brand?.business_name}</div>
                </div>
            </div>
        </BusinessLabelsStyles>
    )
}

export default BusinessLabels;