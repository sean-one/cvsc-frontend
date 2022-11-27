import React from 'react';

import EditBusinessButton from '../buttons/editBusinessButton';
import BusinessRequestToggle from '../buttons/businessRequestToggle';
import BusinessActiveToggle from '../buttons/businessActiveToggle';
import BusinessUserRoles from '../businessUserRoles';

const ManagerMenu = ({ business, role }) => {
    return (
        <div className='bg-light rounded-bottom shadow mb-2 p-2'>
            <EditBusinessButton business={business} role={role} />
            {
                (role.role_type >= 789) &&
                    <BusinessRequestToggle business_id={business.id} request_open={business.business_request_open} />
            }
            {
                (role.role_type >= 789) &&
                    <BusinessActiveToggle business_id={business.id} isActive={business.active_business} />
            }
            <BusinessUserRoles business={business} role={role} />
        </div>
    )
}

export default ManagerMenu;