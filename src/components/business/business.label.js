import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// import useAuth from '../../hooks/useAuth';
import { image_link } from '../../helpers/dataCleanUp';

// import RemoveEventBusinessButton from '../buttons/removeEventBusinessButton';

const BusinessLabelStyles = styled.div`
    .businessLabelsContainer {
        padding: 0.75rem;
        margin-top: 0.375rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-top: 1px dotted var(--secondary-color);
        border-bottom: 1px dotted var(--secondary-color);
    }
    
    .businessLogoContainer {
        display: flex;
        justify-content: space-between;
    }
    
    .businessLogo {
        width: 100%;
        max-width: 5.1rem;
        border: 2px solid var(--trim-color);
        border-radius: 50%;
    }
    
    .businessListing {
        width: 100%;
        display: flex;
        justify-content: center;
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

    .businessName {
        @media (max-width: 275px) {
            display: none;
        }
    }
`;


// const BusinessLabel = ({ businessId, eventCreator, eventId, business_logo, business_name }) => {
const BusinessLabel = ({ businessId, business_logo, business_name }) => {
    // const { isLoggedIn } = useAuth();
    
    let navigate = useNavigate()


    return (
        <BusinessLabelStyles>
            <div className='businessLabelsContainer' onClick={() => navigate(`/business/${businessId}`)}>
                <div className='businessListing'>
                    <div className='businessLogoContainer'>
                        <img className='businessLogo' src={image_link(business_logo)} alt={`${business_name} logo`} />
                    </div>
                    <div className='businessName'>{business_name}</div>
                    {/* {
                        isLoggedIn && <RemoveEventBusinessButton eventId={eventId} businessId={businessId} eventCreator={eventCreator} />
                    } */}
                </div>
            </div>
        </BusinessLabelStyles>
    )
}

export default BusinessLabel;