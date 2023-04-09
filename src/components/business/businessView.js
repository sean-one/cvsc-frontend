import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useBusinessQuery } from '../../hooks/useBusinessApi';
import { image_link } from '../../helpers/dataCleanUp';

import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../loadingSpinner';
import ContactLink from '../contactLink';
import BusinessAdminMenu from './admin/business.admin.menu';
import RelatedEvents from '../events/related.events';

import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, TwitterIcon, WebSiteIcon } from '../icons/siteIcons';

const Styles = styled.div`
    .businessView {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 1080px;
        margin: 0 auto;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px #0D2B12;
        border-radius: 5px;
        background-color: rgba(75,111,81,0.3);
        
        @media (min-width: 768px) {
            padding: 1.5rem;
        }}

    .businessHeader {
        width: 100%;
        display: flex;
        flex-direction: column;}

    .businessName {
        width: 100%;
        display: flex;
        /* justify-content: space-between; */
        /* align-items: center; */
        flex-direction: column;

        @media (min-width: 768px) {
            flex-direction: row-reverse;
            justify-content: space-between;
            align-items: center;

        }}

    .businessName h2 {
        @media (min-width: 768px) {
            align-self: flex-end;
        }}

    .businessDetails {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.75rem 0 1.25rem;
        border-bottom: 1px solid #DAD7CD;
        
        @media (min-width: 768px) {
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
            /* gap: 10px; */
        }}

    .firstBusinessSection {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 0 0.5rem;

        @media (min-width: 768px) {
            flex-basis: 35%;
        }}

    .businessImage {
        width: 100%;
        max-width: 350px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.75rem 0;

        img {
            width: 100%;
            border: 1px solid #dcdbc4;
            display: block;
            border-radius: 50%;
            box-shadow: 5px 5px 5px #010a00;

            @media (min-width: 768px) {
                width: 200px;
            }
        }}

    .secondBusinessSection {
        width: 100%;

        @media (min-width: 768px) {
            flex-basis: 65%;
            padding: 2rem 0;
        }}

    .businessContacts {
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 0.5rem 0;
        margin: 0.5rem 0;
        background-color: rgba(218, 215, 205, 0.2);
        border-radius: 5px;
        gap: 10px;
        
        @media (min-width: 768px) {
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
    const { auth } = useAuth()
    let { business_id } = useParams()
    let business_role = {}

    const { data: business, isLoading } = useBusinessQuery(business_id)

    if (isLoading) { return <LoadingSpinner /> }

    if(auth?.roles) { business_role = auth.roles.find(role => role.business_id === business_id) }


    return (
        <Styles>
            <div className='businessView'>


                <div className='businessHeader'>
                    <div className='businessName'>
                        {
                            (business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && business_role?.active_role === true) &&
                                <BusinessAdminMenu business={business.data} business_role={business_role?.role_type}/>
                        }
                        <h2>{business.data.business_name.toUpperCase()}</h2>
                    </div>
                    {
                        (business.data.location_id !== null) &&
                            <div>{`${business.data?.street_address}, ${business.data?.location_city}`}</div>
                    }
                </div>

                <div className='businessDetails'>

                    <div className='firstBusinessSection'>
                        
                        <div className='businessImage'>
                            <img
                                src={image_link(business.data.business_avatar)}
                                alt={business.data.business_name}
                            />
                        </div>
                        <div className='businessContacts'>
                            <a href={`mailto:${business.data.business_email}`} target='_blank'><MailIcon /></a>

                            {/* dynamically add optional contact information */}
                            {business.data.business_phone && <a href={`tel:${business.data.business_phone}`}><PhoneIcon /></a> }
                            {business.data.business_instagram && <a href={`https://www.instagram.com/${business.data.business_instagram}`} target='_blank'><InstagramIcon /></a> }
                            {business.data.business_facebook && <a href={`https://www.facebook.com/${business.data.business_facebook}`} target='_blank'><FacebookIcon /></a> }
                            {business.data.business_website && <a href={`https://${business.data.business_website}`} target='_blank'><WebSiteIcon /></a> }
                            {business.data.business_twitter && <a href={`https://twitter.com/${business.data.business_twitter}`} target='_blank'><TwitterIcon /></a> }
                        </div>

                    </div>

                    <div className='secondBusinessSection'>
                        <div className='businessDescription'>
                            {business.data.business_description}
                        </div>
                    </div>
                </div>
            </div>
            <RelatedEvents business_ids={[business_id]} />
        </Styles>
    )
}

export default BusinessView;