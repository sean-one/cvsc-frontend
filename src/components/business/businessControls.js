import React from 'react'

import useAuth from '../../hooks/useAuth';

import BusinessRequestToggle from './buttons/businessRequestToggle';
import BusinessActiveToggle from './buttons/businessActiveToggle';
import CreateEventButton from '../events/buttons/createEventButton';
import EditBusinessButton from './buttons/editBusinessButton';
import ViewBusinessButton from './buttons/viewBusinessButton';

const BusinessContols = ({ business }) => {
    const { auth } = useAuth()
    const business_id = business.id

    const business_role = auth?.roles.find(role => role.business_id === business_id)
    
    
    return (
        <div className='d-flex flex-column ps-4 bg-light rounded-bottom shadow mt-2'>
            <div className='d-flex justify-content-around'>
                <ViewBusinessButton business_id={business_id} />
                <CreateEventButton />
                <EditBusinessButton business={business} />
            </div>
            {
                (business_role?.active_role && business_role?.role_type >= 789) &&
                    <BusinessRequestToggle business_id={business.id} request_open={business.business_request_open} />
            }
            {
                (business_role?.active_role && business_role?.role_type >= 789) &&
                    <BusinessActiveToggle business_id={business.id} isActive={business.active_business} />
            }
        </div>
    )
}

export default BusinessContols;