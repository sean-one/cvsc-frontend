import React from 'react'

import BusinessRequestToggle from './buttons/businessRequestToggle';
import BusinessActiveToggle from './buttons/businessActiveToggle';
import CreateEventButton from '../events/buttons/createEventButton';
import EditBusinessButton from './buttons/editBusinessButton';
import ViewBusinessButton from './buttons/viewBusinessButton';

const BusinessContols = ({ business, role_type }) => {
    const business_id = business.id


    return (
        <div className='d-flex flex-column ps-4 bg-light rounded-bottom shadow mt-2'>
            <div className='d-flex justify-content-around'>
                <ViewBusinessButton business_id={business_id} />
                <CreateEventButton />
                <EditBusinessButton business={business} />
            </div>
            {
                (role_type === 'admin') &&
                    <BusinessRequestToggle business_id={business.id} request_open={business.business_request_open} />
            }
            {
                (role_type === 'admin') &&
                    <BusinessActiveToggle business_id={business.id} isActive={business.active_business} />
            }
        </div>
    )
}

export default BusinessContols;