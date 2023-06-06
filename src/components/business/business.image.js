import React from 'react';
import styled from 'styled-components';

import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import LoadingSpinner from '../loadingSpinner';
import { image_link } from '../../helpers/dataCleanUp';

const BusinessImageStyles = styled.div`
    .businessImageWrapper {
        /* width: 100%; */
        /* max-width: 50px; */
        /* margin: 0.25rem 0.5rem; */
        
        img {
            display: block;
            max-width: 75px;
            height: auto;
            border: 1px solid var(--image-border-color);
            border-radius: 50%;
            box-shadow: 5px 5px 5px var(--image-box-shadow-color);
        }
    }
`;

const BusinessImage = ({ businessId }) => {
    const { data: businessList, isLoading, isSuccess } = useBusinessesQuery()
    let business = {}

    if(isLoading) { return <LoadingSpinner /> }

    if(isSuccess) {
        business = businessList?.data.find(business => business.id === businessId)
    }

    return (
        <BusinessImageStyles>
            <div className='businessImageWrapper'>
                <img src={image_link(business.business_avatar)} alt={`${business.business_name} logo`} />
            </div>
        </BusinessImageStyles>
    )
}

export default BusinessImage;