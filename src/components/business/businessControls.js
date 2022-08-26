import React, { useContext } from 'react'

import BusinessRequestToggle from './buttons/businessRequestToggle';
import BusinessActiveToggle from './buttons/businessActiveToggle';
import CreateEventButton from '../events/buttons/createEventButton';
import EditBusinessButton from './buttons/editBusinessButton';
import ViewBusinessButton from './buttons/viewBusinessButton';
import { UsersContext } from '../../context/users/users.provider';

const BusinessContols = ({ business }) => {
    const business_id = business.id
    const { getBusinessRole } = useContext(UsersContext)
    const user_role = getBusinessRole(business_id)


    return (
        <div className='d-flex flex-column ps-4 bg-light rounded-bottom mb-4 shadow'>
            <ViewBusinessButton business_id={business_id} />
            <CreateEventButton />
            <EditBusinessButton business={business} />
            {
                (user_role.role_type === 'admin') &&
                    <BusinessRequestToggle business_id={business.id} request_open={business.business_request_open} />
            }
            {
                (user_role.role_type === 'admin') &&
                    <BusinessActiveToggle business_id={business.id} isActive={business.active_business} />
            }
        </div>
    )
}

export default BusinessContols;