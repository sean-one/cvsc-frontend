import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../hooks/useAuth';
import { useBusinessQuery } from '../../hooks/useBusinessApi';

import LoadingSpinner from '../loadingSpinner';
import BusinessLocation from './location/businessLocation';
import ContactLink from '../contactLink';
import ManagerMenu from './managerMenu/managerMenu';
import BusinessEvents from '../events/eventListing/business.events';


const BusinessView = () => {
    const [ showAdminMenu, setShowAdminMenu ] = useState(false)
    const { auth } = useAuth()
    let { business_id } = useParams()
    let business_role = {}

    if(auth?.roles) {
        business_role = auth?.roles.find(role => role.business_id === business_id) || {}
    }

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
                        <Image src={current_business.business_avatar} alt={current_business.business_name} thumbnail/>
                    </div>
                    <div className='d-flex justify-content-evenly py-2 my-2 w-100 bg-light rounded'>
                        {
                            (business_role?.active_role && (business_role?.role_type >= 456)) &&
                                <div onClick={() => setShowAdminMenu(!showAdminMenu)}>
                                    <FontAwesomeIcon icon={faPen} />
                                </div>
                        }
                        <ContactLink contact_type='email' />

                        {/* dynamically add optional contact information */}
                        { current_business.business_phone && <ContactLink contact_type='phone' /> }
                        { current_business.business_instagram && <ContactLink contact_type='instagram' /> }
                        {current_business.business_facebook && <ContactLink contact_type='facebook' /> }
                        {current_business.business_website && <ContactLink contact_type='website'/> }
                        {current_business.business_twitter && <ContactLink contact_type='twitter' /> }
                    </div>
                </div>
                {
                    (showAdminMenu) &&
                        <ManagerMenu business={current_business} role={business_role} />
                }
                <div className='fs-6 lh-sm border-top border-dark pt-2'>
                    {current_business.business_description}
                </div>
            </div>
            <BusinessEvents business_id={business_id} />
        </div>
    )
}

export default BusinessView;