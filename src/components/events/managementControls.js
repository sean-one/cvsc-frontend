import React from 'react';
import RemoveBusinessFromEvent from './buttons/removeBusinessFromEvent';

const ManagementControls = ({ venue_id, venue_role, brand_id, brand_role, event_id }) => {
    console.log(event_id)
    return (
        <div className='d-flex justify-content-between text-center'>
            <div className='w-50'>
                {
                    (venue_role === 'manager') &&
                        <RemoveBusinessFromEvent event_id={event_id} business_id={venue_id} business_type='venue' />
                    }
            </div>
            <div className='w-50'>
                {
                    (brand_role === 'manager') &&
                        <RemoveBusinessFromEvent event_id={event_id} business_id={brand_id} business_type='brand' />
                }
            </div>
        </div>
    )
}

export default ManagementControls;