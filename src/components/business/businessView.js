import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import { useBusinessQuery } from '../../hooks/useBusinessApi';
import { image_link } from '../../helpers/dataCleanUp';

import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../loadingSpinner';
import ContactLink from '../contactLink';
import BusinessAdminMenu from './admin/business.admin.menu';
import RelatedEvents from '../events/related.events';

const Styles = styled.div`
    .businessHeader {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .businessName {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .businessDetails {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.75rem 0 1.25rem;
        border-bottom: 1px solid #DAD7CD;
        
        @media (min-width: 500px) {
            flex-direction: row;
            gap: 10px;
        }

    }

    .businessImage {
        @media (min-width: 500px) {
            max-width: 200px;
            margin: 0 0.25rem;
        }
    }

    .businessContacts {
        display: flex;
        justify-content: space-evenly;
        padding: 0.5rem 0;
        margin: 0.5rem 0;
        width: 100%;
        border-top: 1px solid #DAD7CD;
        border-bottom: 1px solid #DAD7CD;

        @media (min-width: 500px) {
            border: none;
            align-self: flex-start;
        }

    }

`;

const BusinessView = () => {
    const { auth } = useAuth()
    let { business_id } = useParams()
    let business_role = {}

    let navigate = useNavigate()

    const { data: business, isLoading } = useBusinessQuery(business_id)

    if (isLoading) { return <LoadingSpinner /> }

    if(auth?.roles) { business_role = auth.roles.find(role => role.business_id === business_id) }


    return (
        <Styles>
            <div className='pageWrapper'>

                <div className='businessHeader'>
                    <div className='businessName'>
                        <h2>{business.data.business_name.toUpperCase()}</h2>
                        {
                            (business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && business_role?.active_role === true) &&
                                <div>
                                    <FontAwesomeIcon icon={faPen} onClick={() => navigate(`/business/edit/${business_id}`, { state: business?.data })} size='2x' />
                                </div>
                        }
                    </div>
                    {
                        (business.data.location_id !== null) &&
                            <h4>
                                {`${business.data?.street_address}, ${business.data?.location_city}`}
                            </h4>
                    }
                </div>

                <div className='businessDetails'>

                    <div className='formImage formCirclePreview businessImage'>
                        <img
                            src={image_link(business.data.business_avatar)}
                            alt={business.data.business_name}
                        />
                    </div>

                    <div className='w-100'>
                        <div className='businessContacts'>
                            <ContactLink contact_type='email' />

                            {/* dynamically add optional contact information */}
                            {business.data.business_phone && <ContactLink contact_type='phone' /> }
                            {business.data.business_instagram && <ContactLink contact_type='instagram' /> }
                            {business.data.business_facebook && <ContactLink contact_type='facebook' /> }
                            {business.data.business_website && <ContactLink contact_type='website'/> }
                            {business.data.business_twitter && <ContactLink contact_type='twitter' /> }
                        </div>
                        <div>
                            {business.data.business_description}
                        </div>
                    </div>
                </div>
                {
                    (business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT && business_role?.active_role === true) &&
                        <BusinessAdminMenu business={business.data} business_role={business_role?.role_type}/>
                }


                <RelatedEvents business_ids={[business_id]} />
            </div>
        </Styles>
    )
}

export default BusinessView;