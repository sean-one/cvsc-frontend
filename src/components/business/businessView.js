import React from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap'

import { useBusinessQuery } from '../../hooks/useBusinessApi';
import useAuth from '../../hooks/useAuth';
import { image_link } from '../../helpers/dataCleanUp';

import LoadingSpinner from '../loadingSpinner';
import { EditBusinessButton } from '../menu/buttons/edit_business.button';
import ContactLink from '../contactLink';
import BusinessAdminMenu from './admin/business.admin.menu';
import EventsRelated from '../events/eventsRelated';


const BusinessView = () => {
    const { auth } = useAuth()
    let { business_id } = useParams()
    let business_role = {}

    const { data: business, isLoading } = useBusinessQuery(business_id)

    if (isLoading) {
        return <LoadingSpinner />
    }

    if(auth?.roles) {
        business_role = auth.roles.find(role => role.business_id === business_id)
    }

    console.log(business.data)
    return (
        <div>
            <div>
                <div className='d-flex justify-content-between align-items-center'>
                    <h1 className='mb-1'>{business.data.business_name.toUpperCase()}</h1>
                    {
                        (business_role?.role_type >= 456 && business_role?.active_role === true) &&
                            <div className='px-2'>
                                <EditBusinessButton business={business.data} />
                            </div>
                    }
                </div>
                {
                    (business.data.location_id !== null) &&
                        <div>
                            {`${business.data?.street_address}, ${business.data?.location_city}`}
                        </div>
                }
                <div className='d-flex flex-column align-items-center'>
                    <div className=''>
                        <Image src={image_link(business.data.business_avatar)} alt={business.data.business_name} thumbnail/>
                    </div>
                    <div className='d-flex justify-content-evenly py-2 my-2 w-100 bg-light rounded'>
                        <ContactLink contact_type='email' />

                        {/* dynamically add optional contact information */}
                        {business.data.business_phone && <ContactLink contact_type='phone' /> }
                        {business.data.business_instagram && <ContactLink contact_type='instagram' /> }
                        {business.data.business_facebook && <ContactLink contact_type='facebook' /> }
                        {business.data.business_website && <ContactLink contact_type='website'/> }
                        {business.data.business_twitter && <ContactLink contact_type='twitter' /> }
                    </div>
                </div>
                {
                    (business_role?.role_type >= 456 && business_role?.active_role === true) &&
                        <BusinessAdminMenu business={business.data} business_role={business_role?.role_type}/>
                }
                <div className='fs-6 lh-sm border-top border-dark pt-2'>
                    {business.data.business_description}
                </div>
            </div>
            <EventsRelated business_ids={[business_id]} />
        </div>
    )
}

export default BusinessView;