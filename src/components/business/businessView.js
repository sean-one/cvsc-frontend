import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import { useBusinessQuery } from '../../hooks/useBusinessApi';
import { image_link } from '../../helpers/dataCleanUp';

import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../loadingSpinner';
import ContactLink from '../contactLink';
import BusinessAdminMenu from './admin/business.admin.menu';
import EventsRelated from '../events/eventsRelated';


const BusinessView = () => {
    const { auth } = useAuth()
    let { business_id } = useParams()
    let business_role = {}

    let navigate = useNavigate()

    const { data: business, isLoading } = useBusinessQuery(business_id)

    if (isLoading) {
        return <LoadingSpinner />
    }

    if(auth?.roles) {
        business_role = auth.roles.find(role => role.business_id === business_id)
    }

    
    return (
        <div>
            <div>
                <div className='d-flex justify-content-between align-items-center'>
                    <h1 className='mb-1'>{business.data.business_name.toUpperCase()}</h1>
                    {
                        (business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && business_role?.active_role === true) &&
                            <div className='px-2'>
                                <FontAwesomeIcon icon={faPen} onClick={() => navigate(`/business/edit/${business_id}`, { state: business.data })} />
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
                    (business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && business_role?.active_role === true) &&
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