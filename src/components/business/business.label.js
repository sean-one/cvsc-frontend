import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import LoadingSpinner from '../loadingSpinner';
import { image_link } from '../../helpers/dataCleanUp';

const BusinessLabelStyles = styled.div`
    .businessLabelsContainer {
        padding: 0.25rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-radius: 1rem;
    }
    
    .businessLogoContainer {
        display: flex;
        justify-content: space-between;
    }
    
    .businessLogo {
        width: 100%;
        max-width: 3.4rem;
        border: 2px solid var(--trim-color);
        border-radius: 50%;
    }
    
    .businessListing {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        
        @media (max-width: 350px) {
            width: 100%;
            justify-content: center;
        }

        @media (min-width: 768px) {
            align-self: flex-end;
        }
    }

    .listingReverse {
        flex-direction: row-reverse;
    }

    .businessName {
        @media (max-width: 350px) {
            display: none;
        }
    }
`;


const BusinessLabel = ({ businessId, imageOnly=false, reverseOrder=false }) => {
    const { data: businessList, isLoading, isSuccess } = useBusinessesQuery()
    let business = {}
    let navigate = useNavigate()

    if (isLoading) { return <LoadingSpinner /> }

    if (isSuccess) {
        business = businessList?.data.find(business => business.id === businessId)
    }


    return (
        <BusinessLabelStyles>
            <div className='businessLabelsContainer' onClick={() => navigate(`/business/${businessId}`)}>
                <div className={`businessListing ${reverseOrder ? 'listingReverse' : ''}`}>
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