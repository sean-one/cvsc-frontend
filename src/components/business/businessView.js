import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaRegEnvelope, FaXTwitter, FaInstagram, FaPhone, FaBan } from 'react-icons/fa6'
import { TbWorldWww } from 'react-icons/tb'
import styled from 'styled-components';

import useNotification from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';
import { useBusinessQuery } from '../../hooks/useBusinessApi';

import LoadingSpinner from '../loadingSpinner';
import BusinessEventsRelated from '../events/business.events.related';
import BusinessAdminControls from './admin/business.admin.controls';

const BusinessViewStyles = styled.div`
    .businessViewWrapper {
        display: grid;
        grid-template-areas:
        'businessviewheader'
        'businessviewlogo'
        'businessviewcontacts'
        'businessviewdetails'
        ;
        justify-items: center;
        grid-gap: 1rem;
        width: 100%;
        padding: 1.5rem 1rem;
        background: var(--opacity);
        
        @media (min-width: 768px) {
            border-radius: 1.5rem;
            grid-template-areas:
            'businessviewheader businessviewheader'
            'businessviewlogo businessviewdetails'
            'businessviewlogo businessviewcontacts'
            ;
        }
    }

    .businessViewHeader {
        grid-area: businessviewheader;
        width: 100%;
        color: var(--main-highlight-color);
        display: flex;
        flex-direction: column;
    }

    .businessViewBusinessName {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .businessViewTitle {
        width: 100%;
    }

    .businessViewLogo {
        grid-area: businessviewlogo;
    }

    .businessViewContacts {
        grid-area: businessviewcontacts;
        align-self: start;
        width: 100%;
        max-width: var(--max-section-width);
        display: flex;
        justify-content: space-around;
        padding: 1rem 0;
        margin: 1rem 0;
        color: var(--main-color);
        background-color: var(--main-highlight-color);
        border-radius: 0.5rem;
        gap: 1rem;
    }

    .businessViewDescription {
        grid-area: businessviewdetails;
        align-self: end;
        width: 100%;
        max-width: var(--max-section-width);
        padding: 1rem 0;
        text-align: justify;

        @media (min-width: 768px) {
            text-align: left;
        }
    }
`;

const BusinessView = () => {
    const { isLoggedIn } = useAuth();
    const { dispatch } = useNotification();
    let { business_id } = useParams();

    let navigate = useNavigate();
    const { data: business, isPending, isError, error: business_error } = useBusinessQuery(business_id)
    
    useEffect(() => {
        // 400 - type: 'business_id', 404 - type: 'server'
        if (isError) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: business_error?.response?.data?.error?.message
                }
            })
            
            navigate('/404', { state: { notFound: 'business' }, replace: true })
        }
    }, [isError, business_error, dispatch, navigate])

    if (isPending) { return <LoadingSpinner /> }
    if (!business) { return null; }
    
    
    return (
        <BusinessViewStyles>
            <div className='businessViewWrapper'>
                
                <div className='businessViewHeader'>
                    <div className='businessViewBusinessName'>
                        { (!business?.data?.active_business) && <FaBan className='siteIcons inactiveBusinessIcon' /> }
                        <div className='headerText businessViewTitle'>{business?.data?.business_name?.toUpperCase()}</div>
                        {
                            isLoggedIn ? <BusinessAdminControls business={business?.data} /> : null
                        }
                    </div>
                    {
                        (business?.data?.formatted_address !== null) &&
                            <div className='businessViewAddress'>{business?.data?.formatted_address.replace(/, [A-Z]{2} \d{5}/, '')}</div>
                    }
                </div>

                <div className='imagePreview businessImage businessViewLogo'>
                    <img
                        src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${business?.data?.business_avatar}`}
                        alt={business?.data.business_name}
                    />
                </div>

                <div className='businessViewDescription'>
                    {business?.data.business_description}
                </div>

                <div className='businessViewContacts'>
                    <a href={`mailto:${business?.data.business_email}`} target='_blank' rel='noreferrer'><FaRegEnvelope className='siteIcons' /></a>

                    {/* dynamically add optional contact information */}
                    {business?.data.business_phone && <a href={`tel:${business.data.business_phone}`}><FaPhone className='siteIcons' /></a> }
                    {business?.data.business_instagram && <a href={`https://www.instagram.com/${business.data.business_instagram}`} target='_blank' rel='noreferrer'><FaInstagram className='siteIcons' /></a> }
                    {business?.data.business_website && <a href={`https://${business.data.business_website}`} target='_blank' rel='noreferrer'><TbWorldWww className='siteIcons'/></a> }
                    {business?.data.business_twitter && <a href={`https://twitter.com/${business.data.business_twitter}`} target='_blank' rel='noreferrer'><FaXTwitter className='siteIcons' /></a> }
                </div>
            </div>
            <BusinessEventsRelated business_id={business_id} />
        </BusinessViewStyles>
    )
}

export default BusinessView;