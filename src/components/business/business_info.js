import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClinicMedical, faCannabis } from '@fortawesome/free-solid-svg-icons';

import { UsersContext } from '../../context/users/users.provider';
import { useBusinessRemoveMutation } from '../../hooks/useEvents';

const BusinessInfo = ({ business_id, business_name, business_type, reverse=false }) => {
    const { userProfile, getBusinessRoleType } = useContext(UsersContext)
    const { mutateAsync: removeBusinessMutation } = useBusinessRemoveMutation()
    let role_type = 'none'
    const { event_id } = useParams()
    
    const business_icon = {
        'brand': faCannabis,
        'venue': faClinicMedical,
    }

    if(Object.keys(userProfile).length !== 0) {
        role_type = getBusinessRoleType(business_id)
    }

    const removeBusinessFromEvent = async () => {
        const business_data = {
            business_id,
            business_type
        }

        const remove_response = await removeBusinessMutation({ ...business_data, event_id })

        console.log(remove_response)

    }

    return (
        <div className='w-100'>
            <Link to={{ pathname: `/business/${business_id}` }} className={`d-flex align-items-center pt-1 w-100 ${(reverse) ? 'justify-content-end' : ''}`}>
                <FontAwesomeIcon icon={business_icon[business_type]} className='me-2' />
                <div className='text-truncate'>{business_name}</div>
            </Link>
            {
                (role_type !== 'none') &&
                    <div className='bg-light w-100 rounded text-center' onClick={() => removeBusinessFromEvent()}>
                        Remove
                    </div>
            }
        </div>
    )
}

export default BusinessInfo;