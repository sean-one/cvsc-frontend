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
        justify-content: space-between;
        align-items: center;
    }

    .businessLogoContainer {
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0.5rem;

        img {
            display: block;
            width: 100%;
            max-width: 60px;
            border-radius: 50%;
        }
    }

    .reverseRow {
        flex-direction: row-reverse;
    }
`;


const BusinessLabel = ({ business_id, reverse = false }) => {
    const { data: businessList, isLoading, isSuccess } = useBusinessesQuery()
    let navigate = useNavigate()
    let business = {}

    if(isLoading) { return <LoadingSpinner /> }

    if(isSuccess) {
        business = businessList?.data.find(business => business.id === business_id)
    }


    return (
        <BusinessLabelStyles>
            <div onClick={() => navigate(`/business/${business_id}`)} className={`businessLabelWrapper ${(reverse) ? 'reverseRow' : ''}`}>
                <div className='businessLogoContainer'>
                    <img src={image_link(business?.business_avatar)} alt='business branding' />
                </div>
                <div>{business?.business_name}</div>
            </div>
        </BusinessLabelStyles>
    )
}

export default BusinessLabel;