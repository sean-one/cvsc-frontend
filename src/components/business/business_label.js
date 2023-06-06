import React from 'react';
import styled from 'styled-components';

import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import LoadingSpinner from '../loadingSpinner';
import { image_link } from '../../helpers/dataCleanUp';

const BusinessLabelStyles = styled.div`
    .businessLabelsContainer {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .businessLogoContainer {
        display: flex;
        justify-content: space-between;
    }
    
    .businessLogo {
        width: 100%;
        max-width: 3.4rem;
        border: 2px solid black;
        border-radius: 50%;
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

    .businessName {
        @media (max-width: 350px) {
            display: none;
        }
    }
`;


const BusinessLabel = ({ businessId, imageOnly=false }) => {
    const { data: businessList, isLoading, isSuccess } = useBusinessesQuery()
    let business = {}

    if (isLoading) { return <LoadingSpinner /> }

    if (isSuccess) {
        business = businessList?.data.find(business => business.id === businessId)
    }


    return (
        <BusinessLabelStyles>
            <div className='businessLabelsContainer'>
                <div className='businessListing'>
                    <div className='businessLogoContainer'>
                        <img className='businessLogo' src={image_link(business?.business_avatar)} alt={`${business.businessname} logo`} />
                    </div>
                    {
                        (!imageOnly) && <div className='businessName'>{business?.business_name}</div>
                    }
                </div>
            </div>
        </BusinessLabelStyles>
    )
}

export default BusinessLabel;