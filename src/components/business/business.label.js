import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'

import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import LoadingSpinner from '../loadingSpinner';
import { image_link } from '../../helpers/dataCleanUp';

const BusinessLabelStyles = styled.div`
    .businessLabelWrapper {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .businessLabelLogo {
        width: 100%;
        max-width: 50px;
        margin: 0.25rem 0.5rem;

        img {
            display: block;
            width: 100%;
            border: 1px solid var(--image-border-color);
            border-radius: 50%;
            box-shadow: 5px 5px 5px var(--image-box-shadow-color);
        }
    }

    .businessLabelName {
        padding-left: 0.5rem;
    }
`;


const BusinessLabel = ({ business_id }) => {
    const { data: businessList, isLoading, isSuccess } = useBusinessesQuery()
    let navigate = useNavigate()
    let business = {}

    if(isLoading) { return <LoadingSpinner /> }

    if(isSuccess) {
        business = businessList?.data.find(business => business.id === business_id)
    }


    return (
        <BusinessLabelStyles>
            <div className='businessLabelWrapper' onClick={() => navigate(`/business/${business_id}`)}>
                <div className='businessLabelLogo'>
                    <img src={image_link(business?.business_avatar)} alt={`${business?.business_name} branding`} />
                </div>
                <div className='businessLabelName'>
                    {business?.business_name}
                </div>
            </div>
        </BusinessLabelStyles>
    )
}

export default BusinessLabel;