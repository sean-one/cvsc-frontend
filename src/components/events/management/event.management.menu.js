import React from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';


const EventManagementMenu = ({ brand_role, venue_role }) => {
    
    
    return (
        <div className='bg-light rounded'>
            <Form.Group controlId='remove_business_id' className='my-2'>
                <FloatingLabel controlId='remove_business_id' label='Remove Business'>
                    <Form.Select
                        type='text'
                        name='remove_business_id'
                    >
                        {
                            (brand_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT) &&
                                <option value={brand_role.business_id}>{brand_role.business_name}</option>
                        }
                        {
                            (venue_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT) &&
                                <option value={venue_role.business_id}>{venue_role.business_name}</option>
                        }
                    </Form.Select>
                </FloatingLabel>
                {/* <div className='errormessage'>{errors.remove_business_id?.message}</div> */}
            </Form.Group>
        </div>
    )
}

export default EventManagementMenu;