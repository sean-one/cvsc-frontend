import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap'

import { UsersContext } from '../../context/users/users.provider';
import { useBusinessQuery } from '../../hooks/useBusinessApi';
import { useEventsQuery } from '../../hooks/useEvents';

import LoadingSpinner from '../loadingSpinner';
import BusinessLocation from './location/businessLocation';
import BusinessControls from './businessControls';
import BusinessUserRoles from './businessUserRoles';
import EventList from '../events/eventList';

import ContactDetails from '../contactDetails'


const BusinessView = () => {
    let { business_id } = useParams()
    const { getBusinessRoleType } = useContext(UsersContext)
    const [ role_type ] = useState(getBusinessRoleType(business_id) || 'none')
    
    let business_list = []

    const { data: businessFetch, isLoading: businessLoading, isSuccess: businessSuccess } = useBusinessQuery(business_id)
    const { data: events, isLoading: listLoading, isSuccess: listSuccess } = useEventsQuery()

    if (businessLoading || listLoading) {
        return <LoadingSpinner />
    }

    if (businessSuccess && listSuccess) {
        business_list = events.data.filter(e => e.brand_id === businessFetch.data.id || e.venue_id === businessFetch.data.id)
    }


    const current_business = businessFetch.data

    
    return (
        <div>
            <div>
                <h1 className='mb-0'>{current_business.business_name}</h1>
                { current_business.business_type !== 'brand' && <BusinessLocation business={current_business} /> }
                <div className='d-flex'>
                    <div className='w-100 px-2'>
                        <Image src={current_business.business_avatar} alt={current_business.business_name} thumbnail/>
                    </div>
                    <div className='w-100'>
                        <ContactDetails contact_detail={current_business.business_email} contact_type='email' />

                        {/* dynamically add optional contact information */}
                        { current_business.business_phone && <ContactDetails contact_detail={current_business.business_phone} contact_type='phone' /> }
                        { current_business.business_instagram && <ContactDetails contact_detail={current_business.business_instagram} contact_type='instagram' /> }
                        {current_business.business_facebook && <ContactDetails contact_detail={current_business.business_facebook} contact_type='facebook' /> }
                        {current_business.business_website && <ContactDetails contact_detail={current_business.business_website} contact_type='website'/> }
                        {current_business.business_twitter && <ContactDetails contact_detail={current_business.business_twitter} contact_type='twitter' /> }
                    </div>
                </div>
                {
                    (role_type === 'admin' || role_type === 'manager') &&
                        <BusinessControls business={current_business} role_type={role_type} />
                }
                <div className='fs-6 lh-sm border-top border-dark mt-2 pt-2'>
                    {current_business.business_description}
                </div>
            </div>
            {
                (role_type === 'admin' || role_type === 'manager') &&
                    <BusinessUserRoles business={current_business} />
            }
            <EventList event_list={business_list} business_name={current_business.business_name} />
        </div>
    )
}

export default BusinessView;