import React from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap'

import { useBusinessQuery } from '../../hooks/useBusinessApi';
import { image_link } from '../../helpers/dataCleanUp';

import LoadingSpinner from '../loadingSpinner';
import BusinessLocation from './location/businessLocation';
import ContactLink from '../contactLink';
import EventsRelated from '../events/eventsRelated';


const BusinessView = () => {
    let { business_id } = useParams()

    const { data: businessFetch, isLoading: businessLoading } = useBusinessQuery(business_id)

    if (businessLoading) {
        return <LoadingSpinner />
    }

    const current_business = businessFetch.data


    return (
        <div>
            <div>
                <h1 className='mb-0'>{current_business.business_name}</h1>
                { current_business.business_type !== 'brand' && <BusinessLocation business={current_business} /> }
                <div className='d-flex flex-column align-items-center'>
                    <div className=''>
                        <Image src={image_link(current_business.business_avatar)} alt={current_business.business_name} thumbnail/>
                    </div>
                    <div className='d-flex justify-content-evenly py-2 my-2 w-100 bg-light rounded'>
                        <ContactLink contact_type='email' />

                        {/* dynamically add optional contact information */}
                        { current_business.business_phone && <ContactLink contact_type='phone' /> }
                        { current_business.business_instagram && <ContactLink contact_type='instagram' /> }
                        {current_business.business_facebook && <ContactLink contact_type='facebook' /> }
                        {current_business.business_website && <ContactLink contact_type='website'/> }
                        {current_business.business_twitter && <ContactLink contact_type='twitter' /> }
                    </div>
                </div>
                <div className='fs-6 lh-sm border-top border-dark pt-2'>
                    {current_business.business_description}
                </div>
            </div>
            <EventsRelated business_ids={[business_id]} />
        </div>
    )
}

export default BusinessView;