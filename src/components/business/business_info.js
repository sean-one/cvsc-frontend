import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClinicMedical, faCannabis } from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../hooks/useAuth';
import { useBusinessRemoveMutation } from '../../hooks/useEvents';

const BusinessInfo = ({ business_id, business_name, business_type, reverse=false }) => {
    const { auth } = useAuth()
    let business_role = {}
    const { event_id } = useParams()
    
    const { mutateAsync: removeBusinessMutation } = useBusinessRemoveMutation()
    let navigate = useNavigate()

    const business_icon = {
        'brand': faCannabis,
        'venue': faClinicMedical,
    }

    if(auth?.roles) {
        business_role = auth?.roles.find(role => role?.business_id === business_id) || {}
    }

    const removeBusinessFromEvent = async () => {
        const business_data = {
            business_id,
            business_type
        }

        const remove_response = await removeBusinessMutation({ ...business_data, event_id })
        
        console.log(remove_response)

        if (remove_response.status === 201) {
            navigate('/')
        }
    }

    return (
        <div className='w-100'>
            <Link to={{ pathname: `/business/${business_id}` }} className={`d-flex align-items-center pt-1 w-100 ${(reverse) ? 'justify-content-end' : ''}`}>
                <FontAwesomeIcon icon={business_icon[business_type]} className='me-2' />
                <div className='text-truncate'>{business_name}</div>
            </Link>
            {
                // only viewable to a manager role
                (business_role?.role_type === 456) &&
                    <div className='bg-light w-100 rounded text-center' onClick={() => removeBusinessFromEvent()}>
                        Remove
                    </div>
            }
        </div>
    )
}

export default BusinessInfo;