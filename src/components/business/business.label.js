import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import { image_link } from '../../helpers/dataCleanUp';
import { useRemoveEventBusinessMutation } from '../../hooks/useEventsApi';
import { RemoveBusinessIcon } from '../icons/siteIcons';

const BusinessLabelStyles = styled.div`
    .businessLabelsContainer {
        padding: 0.5rem;
        margin-top: 0.25rem;
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
        max-width: 3.4rem;
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


const BusinessLabel = ({ businessId, eventCreator, eventId, business_logo, business_name }) => {
    const { auth } = useAuth();
    const { mutateAsync: removeEventBusiness } = useRemoveEventBusinessMutation();
    let navigate = useNavigate()

    const removeBusinessFromEvent = async (e) => {
        try {
            e.stopPropagation();

            await removeEventBusiness({ event_id: eventId, business_id: businessId })

        } catch (error) {
            console.log(error)
            return null
        }
    }

    const isCreator = () => auth?.user?.id === eventCreator

    // Check if auth.roles contains event.brand_id or event.venue_id and has a certain role_type
    const isManagement = () => {
        return auth?.roles && auth?.roles.some(role =>
            (role.business_id === businessId) && role.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && role.active_role === true
        );
    };


    return (
        <BusinessLabelStyles>
            <div className='businessLabelsContainer' onClick={() => navigate(`/business/${businessId}`)}>
                <div className='businessListing'>
                    <div className='businessLogoContainer'>
                        <img className='businessLogo' src={image_link(business_logo)} alt={`${business_name} logo`} />
                    </div>
                    <div className='businessName'>{business_name}</div>
                </div>
                {
                    (!isCreator() && isManagement()) &&
                        <div onClick={(e) => removeBusinessFromEvent(e)}>
                            <RemoveBusinessIcon />
                        </div>
                }
            </div>
        </BusinessLabelStyles>
    )
}

export default BusinessLabel;