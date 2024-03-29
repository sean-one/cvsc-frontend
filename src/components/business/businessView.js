import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import useNotification from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';
import { useBusinessQuery } from '../../hooks/useBusinessApi';
import { image_link } from '../../helpers/dataCleanUp';

import LoadingSpinner from '../loadingSpinner';
import BusinessEventsRelated from '../events/business.events.related';
import BusinessAdminControls from './admin/business.admin.controls';

import {
    FacebookIcon,
    InstagramIcon,
    InactiveBusiness,
    MailIcon,
    PhoneIcon,
    TwitterIcon,
    WebSiteIcon,
} from '../icons/siteIcons';

const BusinessViewStyles = styled.div`
    .businessViewWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 1080px;
        padding: 0 0.75rem;
        
        @media (min-width: 768px) {
            padding: 1.5rem 0.75rem;
        }}

    .businessViewHeader {
        width: 100%;
        display: flex;
        flex-direction: column;}
    .businessViewHeaderLeft {
        display: flex;
    }
    .businessViewManagementControls {
        display: flex;
        color: var(--secondary-color);
        gap: 0.75rem;}
    
    .businessViewControl {
        cursor: pointer;}
    
    .businessDetails {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.125rem 0 1.875rem;
        border-bottom: 1px solid var(--secondary-color);
        
        @media (min-width: 768px) {
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
        }}

    .firstBusinessSection {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 0 0.75rem;

        @media (min-width: 768px) {
            flex-basis: 50%;
        }}

    .businessImage {
        max-width: 450px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1.125rem 0;

        img {
            width: 100%;
            max-width: 350px;
            border: 1px solid var(--trim-color);
            display: block;
            border-radius: 55%;
        }}

    .secondBusinessSection {
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;

        @media (min-width: 768px) {
            flex-direction: column;
            flex-basis: 50%;
            padding: 3rem 0;
        }}

    .businessContacts {
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 0.75rem 0;
        margin: 0.75rem 0;
        background-color: var(--black-and-white);
        border-radius: 5px;
        gap: 10px;
        
        @media (min-width: 768px) {
            margin: 2.25rem 0;
            border: none;
            align-self: flex-start;
        }}

    .businessDescription {
        text-align: justify;

        @media (min-width: 768px) {
            text-align: left;
        }}

`;

const BusinessView = () => {
    const { isLoggedIn } = useAuth();
    const { dispatch } = useNotification();
    let { business_id } = useParams();

    let navigate = useNavigate();
    const { data: business, isPending, isError, error: business_error } = useBusinessQuery(business_id)
    
    // 400 - type: 'business_id', 404 - type: 'server'
    if (isError) {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: business_error?.response?.data?.error?.message
            }
        })
        
        navigate('/')
    }

    if (isPending) { return <LoadingSpinner /> }
    
    
    return (
        <BusinessViewStyles>
            <div className='businessViewWrapper'>
                <div className='businessViewHeader'>
                    <div className='sectionRowSplit'>
                        <div className='businessViewHeaderLeft'>
                            { (!business?.data?.active_business) && <InactiveBusiness /> }
                            <div className='headerText'>{business?.data?.business_name?.toUpperCase()}</div>
                        </div>
                        {
                            isLoggedIn ? <BusinessAdminControls business={business?.data} /> : null
                        }
                    </div>
                    {
                        (business?.data?.formatted_address !== null) &&
                            <div>{business?.data?.formatted_address?.split(/\s\d{5},\sUSA/)[0]}</div>
                    }
                </div>

                <div className='businessDetails'>

                    <div className='firstBusinessSection'>
                        
                        <div className='businessImage'>
                            <img
                                src={image_link(business?.data?.business_avatar)}
                                alt={business?.data.business_name}
                            />
                        </div>

                    </div>

                    <div className='secondBusinessSection'>
                        <div className='businessDescription'>
                            {business?.data.business_description}
                        </div>
                        <div className='businessContacts'>
                            <a href={`mailto:${business?.data.business_email}`} target='_blank' rel='noreferrer'><MailIcon /></a>

                            {/* dynamically add optional contact information */}
                            {business?.data.business_phone && <a href={`tel:${business.data.business_phone}`}><PhoneIcon /></a> }
                            {business?.data.business_instagram && <a href={`https://www.instagram.com/${business.data.business_instagram}`} target='_blank' rel='noreferrer'><InstagramIcon /></a> }
                            {business?.data.business_facebook && <a href={`https://www.facebook.com/${business.data.business_facebook}`} target='_blank' rel='noreferrer'><FacebookIcon /></a> }
                            {business?.data.business_website && <a href={`https://${business.data.business_website}`} target='_blank' rel='noreferrer'><WebSiteIcon /></a> }
                            {business?.data.business_twitter && <a href={`https://twitter.com/${business.data.business_twitter}`} target='_blank' rel='noreferrer'><TwitterIcon /></a> }
                        </div>
                    </div>
                </div>
            </div>
            <BusinessEventsRelated business_id={business_id} />
        </BusinessViewStyles>
    )
}

export default BusinessView;