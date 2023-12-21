import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

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
        padding: 0 0.5rem;
        
        @media (min-width: 768px) {
            padding: 1rem 0.5rem;
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
        gap: 0.5rem;}
    
    .businessViewControl {
        cursor: pointer;}
    
    .businessDetails {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.75rem 0 1.25rem;
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
        padding: 0 0.5rem;

        @media (min-width: 768px) {
            flex-basis: 50%;
        }}

    .businessImage {
        max-width: 450px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.75rem 0;

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
            padding: 2rem 0;
        }}

    .businessContacts {
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 0.5rem 0;
        margin: 0.5rem 0;
        background-color: var(--black-and-white);
        border-radius: 5px;
        gap: 10px;
        
        @media (min-width: 768px) {
            margin: 1.5rem 0;
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
    let { business_id } = useParams()

    const { data: business, status } = useBusinessQuery(business_id)
    
    if (status === 'loading') { return <LoadingSpinner /> }
    
    
    return (
        <BusinessViewStyles>
            <div className='businessViewWrapper'>
                <div className='businessViewHeader'>
                    <div className='sectionRowSplit'>
                        <div className='businessViewHeaderLeft'>
                            { (!business?.data?.active_business) && <InactiveBusiness /> }
                            <div className='headerText'>{business?.data?.business_name?.toUpperCase()}</div>
                        </div>
                        <BusinessAdminControls business={business?.data} />
                    </div>
                    {
                        (business?.data?.formatted_address !== null) &&
                            <div>{business?.data?.formatted_address.split(/\s\d{5},\sUSA/)[0]}</div>
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